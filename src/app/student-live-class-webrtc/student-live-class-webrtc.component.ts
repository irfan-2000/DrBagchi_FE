import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track } from 'livekit-client';
import { environment } from '../environments/environment.prod';
import { identity } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-student-live-class-webrtc',
  standalone: false,
  templateUrl: './student-live-class-webrtc.component.html',
  styleUrl: './student-live-class-webrtc.component.css'
})
export class StudentLiveClassWebrtcComponent {
  private livekitUrl = environment.livekitUrl;
  private baseUrl = environment.baseUrl;

  room!: Room;

  // Keep a reference to the screen-share track so we can create a fallback
  // fullscreen video element if the template video is not yet connected.
  screenShareTrack: any = null;

  @ViewChild('teacherScreen', { static: true })
  teacherScreen!: ElementRef<HTMLVideoElement>;

  @ViewChild('teacherCamera')
  teacherCamera!: ElementRef<HTMLVideoElement>;

  @ViewChild('teacherScreenMobile', { static: false })
  teacherScreenMobile!: ElementRef<HTMLVideoElement>;

  isConnected = false;
  
  studentIdentity :any; // 🔑 SINGLE SOURCE OF TRUTH
roomName :any;
CourseId:any;
 BatchId:any;

constructor( private route: ActivatedRoute)
{
  this.studentIdentity = window.localStorage.getItem('userid');
 
  this.route.queryParamMap.subscribe(params => {
  this.CourseId   = params.get('CourseId');
  this.BatchId    = params.get('BatchId');
  this.roomName = params.get('ChatroomId');

 });
 
}

  /* -------------------------------
     STEP 3.1 – CONNECT AS STUDENT
  --------------------------------*/
ngOnInit() {
  document.addEventListener('fullscreenchange', () => {
    console.log('📱 Fullscreen changed. Now fullscreen:', !!document.fullscreenElement);
    if (!document.fullscreenElement) {
      this.isFullScreenActive = false;
      document.body.classList.remove('mobile-fullscreen-active');
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    }
  });

  // Monitor device orientation changes
  window.addEventListener('orientationchange', () => {
    console.log('🔄 orientationchange event fired');
    console.log('  window.orientation:', window.orientation);
    console.log('  screen.orientation.type:', (screen.orientation as any).type);
    console.log('  window.innerWidth x innerHeight:', window.innerWidth, 'x', window.innerHeight);
    console.log('  screen.width x screen.height:', screen.width, 'x', screen.height);
  });

  // Monitor screen orientation changes via ScreenOrientation API
  if (screen.orientation) {
    (screen.orientation as any).addEventListener('change', () => {
      console.log('📱 Screen orientation API change event');
      console.log('  New type:', (screen.orientation as any).type);
      console.log('  window.innerWidth x innerHeight:', window.innerWidth, 'x', window.innerHeight);
    });
  }
}


 async joinClass() 
 {
  console.log('🔵 JOIN CLASS BUTTON CLICKED');
  console.log('  Identity:', this.studentIdentity);
  console.log('  Room:', this.roomName);
  console.log('  Course:', this.CourseId);
  console.log('  LiveKit URL:', this.livekitUrl);
  console.log('  Base URL:', this.baseUrl);
  
  // Validate required data
  if (!this.studentIdentity) {
    alert('❌ Error: Student ID not found. Please log in again.');
    return;
  }
  if (!this.roomName) {
    alert('❌ Error: Room name not found. Invalid class link.');
    return;
  }
  if (!this.livekitUrl) {
    alert('❌ Error: LiveKit URL not configured in environment.');
    return;
  }
  if (!this.baseUrl) {
    alert('❌ Error: Backend URL not configured in environment.');
    return;
  }
  
  this.hasUserInteracted = true;

  try {
     console.log('📡 Fetching token from:', this.baseUrl);
     const tokenRes = await fetch(`${this.baseUrl}api/guest/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: this.roomName,
        identity: this.studentIdentity
      })
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token API failed (${tokenRes.status}): ${errText}`);
    }
    const tokenData = await tokenRes.json();
    const token = tokenData.token;
    if (!token) throw new Error('Token missing in response. Response: ' + JSON.stringify(tokenData));
    console.log('✅ Got token');

    // 2️⃣ Create Room
    console.log('🎬 Creating Room object...');
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true
    });
    console.log('✅ Room created');

    // 3️⃣ Register track handlers
    console.log('📻 Registering track handlers...');
    this.registerTrackHandlers();
    console.log('✅ Track handlers registered');

    // 4️⃣ Connect
    console.log('🔗 Connecting to LiveKit at:', this.livekitUrl);
    await this.room.connect(this.livekitUrl, token);
    console.log('✅ Connected to LiveKit');

    // 5️⃣ Start audio
    console.log('🔊 Starting audio...');
    await this.room.startAudio();
    this.isConnected = true;
    console.log('✅ Student connected and audio started');

    // 6️⃣ Listen for admin mic lock
    this.room.on(RoomEvent.ParticipantMetadataChanged, (metadata, participant) => {
 
      try {
        const data = JSON.parse(metadata || '{}');
        if (data.micLocked === true) {
          // Force stop microphone
          this.forceStopMicrophone();
          // Show alert box to student
          //a//lert('🔇 Your microphone has been muted by the admin.');
        }
      } catch (e) {
        console.warn('Invalid metadata:', metadata);
      }
    });

    this.room.on(RoomEvent.ParticipantPermissionsChanged, (permissions, participant) => {
  

      if (!permissions?.canPublish) {
        // Force stop microphone
        this.forceStopMicrophone();
        // Show alert box to student
       // alert('🔇 You are not allowed to publish audio/video. Microphone muted by admin.');
      }
    });

    // 7️⃣ Notify backend about join
    console.log('🔔 Notifying backend about join...');
    const joinRes = await fetch(`${this.baseUrl}api/guest/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: this.roomName,
        identity: this.studentIdentity
      })
    });
    if (!joinRes.ok) {
      const joinErrText = await joinRes.text();
      console.warn('⚠️ Backend join notification failed (non-blocking):', joinRes.status, joinErrText);
    }

    console.log('✅ Backend notified about join');

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('❌ Join failed:', err);
    console.error('Error details:', errorMsg);
    
    // Show full error in alert
    alert('❌ Failed to join class.\n\nError: ' + errorMsg);
  }
}



// registerTrackHandlers() {
//   this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
//     console.log(`📥 Track Subscribed: ${publication.source} from ${participant.identity}`);

//     if (track.kind === Track.Kind.Video)
//        {
//       const videoEl = this.teacherScreen.nativeElement;
      
//       // Use LiveKit's built-in .attach() - it's much safer than manual MediaStream
//       track.attach(videoEl);
      
//       videoEl.play().catch(err => {
//         console.warn('⚠️ Auto-play failed, usually requires a click:', err);
//       });
//     }

//   if (publication.source === Track.Source.Camera) {
//         console.log('🎥 Teacher camera received');

//         const videoEl = this.teacherCamera.nativeElement;
//         videoEl.srcObject = new MediaStream([track.mediaStreamTrack]);

//         videoEl.play().catch(() => {
//           console.warn('Camera autoplay blocked');
//         });
//       }

//     if (track.kind === Track.Kind.Audio) {
//       // Audio tracks also need to be attached to the DOM to be heard
//       const audioElement = track.attach();
//       document.body.appendChild(audioElement);
//     }
//   });

//   // Log when teacher is already in room with tracks
//   this.room.on(RoomEvent.ParticipantConnected, (p) => {
//      console.log('Teacher/Participant joined:', p.identity);
//   });
// }
 
registerTrackHandlers() {

  // 1️⃣ Handle tracks that arrive AFTER join
  this.room.on(
    RoomEvent.TrackSubscribed,
    (track, publication, participant) => {

      console.log(
        `📥 TrackSubscribed → ${publication.source} | ${track.kind} | ${participant.identity}`
      );

      this.attachTrack(track, publication);
    }
  );

    // keep track-unsubscribe handler for cleanup
    this.watchTrackUnsubscribed();

  // 2️⃣ VERY IMPORTANT: Handle tracks that already exist ON JOIN / RELOAD
  this.room.remoteParticipants.forEach((participant) => {
    participant.trackPublications.forEach((publication) => {
      if (publication.track) {
        console.log(
          `♻️ Existing track → ${publication.source} | ${publication.kind} | ${participant.identity}`
        );

        this.attachTrack(publication.track, publication);
      }
    });
  });
}

private attachTrack(track: any, publication: any) {
  console.log(`🔌 Attaching track - Kind: ${track.kind}, Source: ${publication.source}`);

  // 🖥️ SCREEN SHARE
  if (
    track.kind === Track.Kind.Video &&
    publication.source === Track.Source.ScreenShare
  ) {
    console.log('🖥️ Screen share track detected, attaching to video elements...');

    // store reference for fullscreen fallback
    this.screenShareTrack = track;

    // Determine which video element(s) to use based on viewport
    const isMobile = window.innerWidth <= 1024;
    console.log(`  📱 Is mobile view: ${isMobile}`);

    if (isMobile && this.teacherScreenMobile?.nativeElement) {
      console.log('  ✅ Using mobile video element');
      try {
        track.attach(this.teacherScreenMobile.nativeElement);
        console.log('  ✅ Successfully attached to mobile video');
      } catch (err) {
        console.error('  ❌ Failed to attach to mobile video:', err);
      }
    } else if (!isMobile && this.teacherScreen?.nativeElement) {
      console.log('  ✅ Using desktop video element');
      try {
        track.attach(this.teacherScreen.nativeElement);
        console.log('  ✅ Successfully attached to desktop video');
      } catch (err) {
        console.error('  ❌ Failed to attach to desktop video:', err);
      }
    } else {
      console.warn('  ⚠️ No suitable video element found! Mobile:', isMobile, 'Elements:', {
        teacherScreenMobile: !!this.teacherScreenMobile?.nativeElement,
        teacherScreen: !!this.teacherScreen?.nativeElement
      });
    }

    return;
  }

  // 🎥 CAMERA
  if (
    track.kind === Track.Kind.Video &&
    publication.source === Track.Source.Camera
  ) {
    console.log('🎥 Camera track detected, attaching...');

    const videoEl = this.teacherCamera?.nativeElement;
    if (!videoEl) {
      console.warn('  ⚠️ Teacher camera video element not found');
      return;
    }

    // 🔥 REQUIRED FOR AUTOPLAY
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;

    try {
      track.attach(videoEl);
      console.log('  ✅ Successfully attached to camera video');

      // 🔥 FORCE PLAY
      videoEl.play()
        .then(() => console.log('  ✅ Camera playing'))
        .catch(err => console.warn('  ⚠️ Camera play blocked', err));
    } catch (err) {
      console.error('  ❌ Failed to attach camera:', err);
    }

    return;
  }

  // 🔊 AUDIO
  if (track.kind === Track.Kind.Audio) {
    console.log('🔊 Audio track detected, attaching...');

    try {
      const audioEl = track.attach();
      audioEl.autoplay = true;
      audioEl.muted = false;
      document.body.appendChild(audioEl);
      console.log('  ✅ Audio attached to document body');
    } catch (err) {
      console.error('  ❌ Failed to attach audio:', err);
    }
  }
}

// Keep screenShareTrack in sync when unsubscribed
private watchTrackUnsubscribed() {
  this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    if (publication.source === Track.Source.ScreenShare) {
      this.screenShareTrack = null;
    }
  });
}


  async connectAsStudent(url: string, token: string)
   {
     this.room = new Room({
    adaptiveStream: true,
    dynacast: true
   });
   
    await this.room.connect(url, token, {
      autoSubscribe: true // ✅ CORRECT PLACE
    });

   /// await this.room.connect(url, token);
    this.isConnected = true;
 

 debugger
   

    console.log('✅ Student connected to LiveKit');
  }

  async forceStopMicrophone() 
  {

  const localParticipant = this.room.localParticipant;

  console.log('🛑 Force stopping mic');

  const audioPublications = Array.from(
    localParticipant.audioTrackPublications.values()
  );

  for (const pub of audioPublications) {
    if (pub.track) {
      await localParticipant.unpublishTrack(pub.track);
      pub.track.stop();
    }
  }

  this.isMicOn = false;
}

  /* -------------------------------
     STEP 3.2 – RECEIVE TEACHER TRACKS
  --------------------------------*/
 registerTrackHandlers_old() {

  console.log('📡 Registering LiveKit track handlers');

  // Log when any participant connects
  debugger
  this.room.on(RoomEvent.ParticipantConnected, (participant) => {
    console.log('👤 Participant connected:', participant.identity);
  });

  // Log when any track is published
  this.room.on(
    RoomEvent.TrackPublished,
    (publication, participant) => {
      console.log('📤 Track published:', {
        participant: participant.identity,
        kind: publication.kind,
        source: publication.source,
        trackSid: publication.trackSid
      });
    }
  );

  // Log when subscription happens
  this.room.on(
    RoomEvent.TrackSubscribed,
    (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant
    ) => {

      console.log('📥 Track SUBSCRIBED EVENT FIRED');
      console.log('  👤 From participant:', participant.identity);
      console.log('  🎞️ Track kind:', track.kind);
      console.log('  📡 Track source:', publication.source);
      console.log('  🆔 Track SID:', track.sid);
      console.log('  🔊 Is enabled:', track);

      // Check video element
      const videoEl = this.teacherScreen?.nativeElement;
      console.log('🎥 Video element exists:', !!videoEl);

      if (!videoEl) {
        console.error('❌ teacherScreen video element NOT FOUND');
        return;
      }

      // Only process screen-share video
      if (
        track.kind === Track.Kind.Video &&
        publication.source === Track.Source.ScreenShare
      ) {
        console.log('🖥️ Teacher SCREEN track confirmed');

        const mediaStream = new MediaStream([
          track.mediaStreamTrack
        ]);

        videoEl.srcObject = mediaStream;

        videoEl
          .play()
          .then(() => {
            console.log('✅ Video play() resolved successfully');
          })
          .catch(err => {
            console.warn('⚠️ Video play() blocked:', err);
          });

      } else {
        console.warn('⚠️ Ignored track (not screen share)');
      }
    }
  );

  // Log if track is unsubscribed
  this.room.on(
    RoomEvent.TrackUnsubscribed,
    (track, publication, participant) => {
      console.log('📴 Track unsubscribed:', {
        participant: participant.identity,
        kind: track.kind,
        source: publication.source
      });
    }
  );

  // Log connection state changes
  this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
    console.log('🔌 Connection state changed:', state);
  });
}


  /* -------------------------------
     CLEANUP
  --------------------------------*/
  ngOnDestroy() {
    if (this.room) {
      this.room.disconnect();
    }
 
  }
hasUserInteracted: boolean = false;

  joinClass_old()
   {
  this.hasUserInteracted = true;

  // Resume AudioContext safely
  if (this.room) {
    this.room.startAudio();
  }

  console.log('▶️ User interaction done, media allowed');
}

// 🔹 UI state for chat panel
isChatOpen = false;

// 🔹 Toggle chat open / close
toggleChat() {
  this.isChatOpen = !this.isChatOpen;
}

isMicOn = false;
localAudioTrack: MediaStreamTrack | null = null;
 
async toggleMic()
 {
  if (!this.room) return;

  const videoEl = this.teacherScreen?.nativeElement;
debugger
  // 1️⃣ Check server-side mute-all / admin lock
  try {
    const res = await fetch(`${this.baseUrl}api/guest/mute-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: this.roomName,
        identity: this.studentIdentity
      })
    });
    const data = await res.json();
    const muteAllActive = data;

    if (muteAllActive) {
      alert('🔇 Your microphone is muted by the admin.');
      return; // prevent toggling mic
    }
  } catch (err) {
    console.warn('Could not check mute status:', err);
  }

  // 2️⃣ TURN MIC OFF
  if (this.isMicOn && this.localAudioTrack) {
    await this.room.localParticipant.unpublishTrack(this.localAudioTrack);
    this.localAudioTrack.stop();
    this.localAudioTrack = null;
    this.isMicOn = false;

    if (videoEl) videoEl.muted = false; // resume teacher audio

    console.log('🔇 Student mic OFF');
    return;
  }

  // 3️⃣ TURN MIC ON
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  this.localAudioTrack = stream.getAudioTracks()[0];

  await this.room.localParticipant.publishTrack(this.localAudioTrack);

  this.isMicOn = true;

  if (videoEl) videoEl.muted = true; // mute teacher to avoid echo

  console.log('🎙️ Student mic ON');
}

   unreadCount = 0;
  currentSpeaker: string | null = null;

  messages: { user: string; text: string; time: string }[] = [];
  chatInput = '';
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  sendMessage() {
    if (!this.chatInput.trim()) return;
    this.messages.push({ user: 'You', text: this.chatInput, time: this.getTime() });
    this.chatInput = '';

    setTimeout(() => this.scrollChatToBottom(), 50);
  }

  scrollChatToBottom() {
    const el = this.chatContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  getTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isFullScreenActive = false; // track fullscreen state for CSS

  async toggleFullScreen() {
  const isMobile = window.innerWidth <= 1024;
  const orientation = screen.orientation as any;

  const safeRequest = async (el: Element | null) => {
    if (!el) return false;
    // Ensure element is attached to the DOM
    if (!(el as any).isConnected) return false;
    try {
      if (!document.fullscreenElement) {
        await (el as any).requestFullscreen();
        return !!document.fullscreenElement;
      } else {
        await document.exitFullscreen();
        return false;
      }
    } catch (err) {
      console.warn('Fullscreen request failed', err);
      return false;
    }
  };

  if (isMobile) {
    // Prefer the dedicated mobile video element. If not present, try the desktop screen video.
    const video = this.teacherScreenMobile?.nativeElement || this.teacherScreen?.nativeElement;

    if (video && (video as any).isConnected) {
      try {
        if (!document.fullscreenElement) {
          console.log('📱 Attempting fullscreen + landscape rotation...');
          console.log('Current window orientation:', window.orientation);
          console.log('Current screen.orientation:', (screen.orientation as any).type);
          
          await (video as any).requestFullscreen();
          this.isFullScreenActive = true;
          document.body.classList.add('mobile-fullscreen-active');
          
          // delay to let fullscreen fully enter before locking orientation
          await new Promise(resolve => setTimeout(resolve, 150));
          
          console.log('🔄 Trying to lock orientation to landscape...');
          const screenOrientation = screen.orientation as any;
          if (screenOrientation && screenOrientation.lock) {
            try {
              const lockPromise = screenOrientation.lock('landscape-primary').catch(() => {
                // Try alternative
                return screenOrientation.lock('landscape');
              });
              await lockPromise;
              console.log('✅ Orientation lock successful');
              console.log('After lock - screen.orientation.type:', screenOrientation.type);
            } catch (lockErr) {
              console.error('❌ Orientation lock FAILED:', lockErr);
              // Even if lock fails, fullscreen is active
            }
          } else {
            console.warn('⚠️ screen.orientation.lock() not available on this device/browser');
          }
        } else {
          console.log('📱 Exiting fullscreen...');
          await document.exitFullscreen();
          this.isFullScreenActive = false;
          document.body.classList.remove('mobile-fullscreen-active');
          
          const screenOrientation = screen.orientation as any;
          if (screenOrientation && screenOrientation.unlock) {
            try {
              await screenOrientation.unlock();
              console.log('✅ Orientation unlocked');
            } catch (e) {
              console.warn('⚠️ Orientation unlock failed', e);
            }
          }
        }
      } catch (err) {
        console.error('❌ Fullscreen request failed:', err);
        this.isFullScreenActive = false;
      }

      return;
    }

    // If the template video isn't connected yet, but we have an active screen-share track,
    // create a temporary video element attached to the track and request fullscreen on it.
    if (this.screenShareTrack) {
      try {
        const tempEl: HTMLVideoElement = this.screenShareTrack.attach();
        tempEl.setAttribute('data-temp-fullscreen', '1');
        tempEl.style.width = '100%';
        tempEl.style.height = '100%';
        tempEl.style.objectFit = 'contain';
        tempEl.playsInline = true;
        tempEl.autoplay = true;
        document.body.appendChild(tempEl);

        const onFsChange = () => {
          if (!document.fullscreenElement) {
            // exit: remove temporary element and detach
            try {
              this.screenShareTrack.detach(tempEl);
            } catch (e) { /* ignore */ }
            if (tempEl.parentNode) tempEl.parentNode.removeChild(tempEl);
            document.removeEventListener('fullscreenchange', onFsChange);
          }
        };

        document.addEventListener('fullscreenchange', onFsChange);

        console.log('📱 Fullscreen via temp element, attempting landscape lock...');
        await tempEl.requestFullscreen();
        this.isFullScreenActive = true;
        document.body.classList.add('mobile-fullscreen-active');
        
        // delay to let fullscreen fully enter before locking orientation
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const screenOrientation = screen.orientation as any;
        if (screenOrientation && screenOrientation.lock) {
          try {
            await screenOrientation.lock('landscape-primary').catch(() => {
              return screenOrientation.lock('landscape');
            });
            console.log('✅ Orientation locked to landscape (temp element)');
          } catch (e) {
            console.error('❌ Orientation lock failed on temp element', e);
          }
        } else {
          console.warn('⚠️ screen.orientation.lock() not available');
        }
        return;
      } catch (err) {
        console.warn('Fallback fullscreen via temporary video element failed', err);
      }
    }

    console.warn('Mobile video element not available or not connected; fullscreen skipped');

  } else {
    const container = document.getElementById('liveContainer');
    await safeRequest(container);
  }
}



isMobileView: boolean = false;
isLandscape: boolean = false;
isFullScreen: boolean = false;


// Add this method to check viewport
checkScreenSize() {
  this.isMobileView = window.innerWidth <= 1024;
}

expandChat() {
  this.isChatOpen = true;
  this.unreadCount = 0;
}

collapseChat() {
  this.isChatOpen = false;
}

@HostListener('window:resize')
onResize() {
  this.checkScreenSize();
}

 

}
