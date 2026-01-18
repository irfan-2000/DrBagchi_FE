import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('teacherScreen', { static: true })
  teacherScreen!: ElementRef<HTMLVideoElement>;

@ViewChild('teacherCamera')
teacherCamera!: ElementRef<HTMLVideoElement>;

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
  async ngOnInit() {
  // We do NOT connect in ngOnInit to avoid the Autoplay/AudioContext block.
  // We only prepare the UI.
}


 async joinClass() 
 {
  this.hasUserInteracted = true;

  try {
     const tokenRes = await fetch(`${this.baseUrl}api/guest/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: this.roomName,
        identity: this.studentIdentity
      })
    });

    if (!tokenRes.ok) throw new Error('Failed to fetch token');
    const tokenData = await tokenRes.json();
    const token = tokenData.token;
    if (!token) throw new Error('Token missing in response');

    // 2️⃣ Create Room
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true
    });

    // 3️⃣ Register track handlers
    this.registerTrackHandlers();

    // 4️⃣ Connect
    console.log('🔗 Connecting to LiveKit...');
    await this.room.connect(this.livekitUrl, token);

    // 5️⃣ Start audio
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
    await fetch(`${this.baseUrl}api/guest/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomName: this.roomName,
        identity: this.studentIdentity
      })
    });

    console.log('🔔 Notified backend about join');

  } catch (err) {
    console.error('Join failed', err);
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

  // 🖥️ SCREEN SHARE
  if (
    track.kind === Track.Kind.Video &&
    publication.source === Track.Source.ScreenShare
  ) {
    console.log('🖥️ Attaching teacher screen');

    track.attach(this.teacherScreen.nativeElement);
    return;
  }

  // 🎥 CAMERA
// 🎥 CAMERA
if (
  track.kind === Track.Kind.Video &&
  publication.source === Track.Source.Camera
) {
  console.log('🎥 Attaching teacher camera');

  const videoEl = this.teacherCamera.nativeElement;

  // 🔥 REQUIRED FOR AUTOPLAY
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.autoplay = true;

  track.attach(videoEl);

  // 🔥 FORCE PLAY
  videoEl.play()
    .then(() => console.log('✅ Camera playing'))
    .catch(err => console.warn('❌ Camera play blocked', err));

  return;
}


  // 🔊 AUDIO
  if (track.kind === Track.Kind.Audio) {
    console.log('🔊 Attaching audio track');

    const audioEl = track.attach();
    audioEl.autoplay = true;
    audioEl.muted = false;
    document.body.appendChild(audioEl);
  }
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



}
