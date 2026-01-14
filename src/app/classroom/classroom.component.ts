import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  OnDestroy,
  NgZone 
} from '@angular/core';
import { Room, createLocalAudioTrack, LocalAudioTrack, RoomEvent } from 'livekit-client';
import Hls from 'hls.js';
import { environment } from '../environments/environment';
import { MyCoursesService } from '../my-courses.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-classroom',
  standalone: false,
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css',
})
export class ClassroomComponent implements AfterViewInit, OnDestroy
 {

private baseurl = environment.baseUrl;

@ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  private streamUrl: string = 'https://drbagchisclasses.b-cdn.net/1234/index.m3u8';
  
  room!: Room;
  localAudioTrack: LocalAudioTrack | null = null;
  isMicOn: boolean = false;
  isJoined: boolean = false; // Controls the overlay
  chatInput:any = ''
  private hls: Hls | null = null;
chatMessages:any = [];
classannouncement:any = [];


CourseId:any;
ChatroomId:any;
BatchId:any;


  constructor(private ngZone: NgZone,private mycourses:MyCoursesService,private router:Router,  private route: ActivatedRoute,
) {

this.route.queryParamMap.subscribe(params => {
  this.CourseId   = params.get('CourseId');
  this.BatchId    = params.get('BatchId');
  this.ChatroomId = params.get('ChatroomId');

 });

  
    this.GetOngoingClass();

  }

  ngAfterViewInit() {
    // We don't auto-start here to avoid Autoplay Blocked errors
    console.log('Component ready. Waiting for user to click Join.');
  }

  /**
   * This method is triggered by a User Gesture (Click)
   * It solves both the Autoplay and the Hydration stability issues.
   */


    initializeHlsPlayer(): void {
    const video = this.videoPlayer.nativeElement;

    // Hard-set muted and attributes before attaching HLS
    video.muted = true;
    video.setAttribute('muted', 'true'); 
    video.setAttribute('autoplay', 'true');
    video.setAttribute('playsinline', 'true');

    if (Hls.isSupported()) {
      this.hls = new Hls({
        // enableWorker: true,
        // lowLatencyMode: true,

        enableWorker: true,
        lowLatencyMode: true, // Specifically for LL-HLS
        
        // liveSyncDuration: How many seconds behind the live edge to start.
        // Setting this to 3-6 seconds is usually safe.
        liveSyncDuration: 4, 
        
        // liveMaxLatencyDuration: If the lag grows larger than this, 
        // the player will skip forward to catch up.
        liveMaxLatencyDuration: 10,
        
        // High-performance buffer management
        maxBufferLength: 10,
        liveBackBufferLength: 0 // Don't keep old video in memory

      });

      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hls!.loadSource(this.streamUrl);
      });

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.error("Play failed after manifest:", err));
      });


      this.hls.on(Hls.Events.LEVEL_UPDATED, (_, data:any) => {
  const video = this.videoPlayer.nativeElement;
  const liveEdge = data.details.liveEdge;

    if (liveEdge && video.currentTime < liveEdge - 3) {
      console.warn('⏩ Jumping to live edge');
      video.currentTime = liveEdge;
    }
  });

         

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) this.hls?.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) this.hls?.recoverMediaError();
        }
      });
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.streamUrl;
      video.addEventListener('loadedmetadata', () => video.play());
    }
  }

  joinClassroom(): void {
    this.isJoined = true;
    
    // Run outside Angular to prevent NG0506 Hydration errors
    this.ngZone.runOutsideAngular(() => {
      this.initializeHlsPlayer();
      this.connectToLiveKit();
    });
  }
  
  isPublishing: boolean = false; // Prevent double-publishing clicks
isHardLocked:boolean = false;

async connectToLiveKit_old(): Promise<void> 
{
    try {
      const identity = 'student_' + Math.floor(Math.random() * 10000);
      const res = await fetch(`${this.baseurl}api/guest/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, room: this.ChatroomId })
      });
      const data = await res.json();

      this.room = new Room();
      
      // Clean up on disconnect
      this.room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit');
      });
 
// this.room.on(RoomEvent.ParticipantMetadataChanged, (metadata: any, participant) => {
//   if (participant.identity === this.room.localParticipant.identity) {
//     try {
//       const data = JSON.parse(metadata);
      
//       this.ngZone.run(async () => {
//         if (data.micLocked === false && this.isHardLocked === true) {
//           // 1. Clear the hard lock state
//           this.isHardLocked = false;
          
//           // 2. CRITICAL: If the mic was "on" when locked, we must reset it
//           if (this.isMicOn) {
//             console.log("Permissions restored. Restarting audio stream...");
//             await this.forceResetMicrophone();
//           }
          
//           alert("Your microphone is now unlocked. You can speak now.");
//         } else if (data.micLocked === true) {
//           this.isHardLocked = true;
//           this.isMicOn = false;
//           // Stop current track so the "red light" goes off
//           if (this.localAudioTrack) {
//             this.localAudioTrack.stop();
//             this.localAudioTrack = null;
//           }
//         }
//       });
//     } catch (e) { console.error(e); }
//   }
// });


// --- ADD THIS INSIDE connectToLiveKit() ---

 
      await this.room.connect('wss://livekit.race-elearn.com', data.token);
      console.log('Connected to LiveKit:', identity);
    } catch (e) {
      console.error('LiveKit connection failed', e);
    }
}


async connectToLiveKit(): Promise<void> {
  try {
    const identity = 'student_' + Math.floor(Math.random() * 10000);
    const res = await fetch(`${this.baseurl}api/guest/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, room: this.ChatroomId })
    });
    const data = await res.json();

    this.room = new Room();

    // 1. Connect FIRST
    await this.room.connect('wss://livekit.race-elearn.com', data.token);
    console.log('✅ Connected to LiveKit:', identity);

    // 2. Now that we are connected, check INITIAL permissions
    // This handles the case where the teacher muted the room before you joined
    const initialCanPublish = this.room.localParticipant.permissions?.canPublish;
    console.log(`Initial Permission Check: canPublish = ${initialCanPublish}`);
    
    if (initialCanPublish === false) {
      this.ngZone.run(() => {
        this.isHardLocked = true;
        this.isMicOn = false;
      });
    }

    // 3. Setup Listeners for LATER changes
    this.room.on(RoomEvent.ParticipantPermissionsChanged, (prev, participant) => {
      // Ensure we only react to OUR permissions
      if (participant.sid === this.room.localParticipant.sid) {
        const canPublish = participant.permissions?.canPublish;
        console.log(`%c [Permission Update] Can I Speak? ${canPublish}`, 'background: #222; color: #bada55');

        this.ngZone.run(async () => {
          if (canPublish === false) {
            this.handleRemoteMute();
          } else {
            this.isHardLocked = false;
            console.log("Teacher allowed microphone access.");
          }
        });
      }
    });

    this.room.on(RoomEvent.Disconnected, () => console.log('Disconnected'));

  } catch (e) {
    console.error('LiveKit connection failed', e);
  }
}

/**
 * Helper to clean up UI and Tracks when muted by teacher
 */
private async handleRemoteMute() {
  this.isHardLocked = true;
  this.isMicOn = false;
  console.warn("SERVER REVOKED MIC PERMISSIONS");
  
  if (this.localAudioTrack) {
    try {
      await this.room.localParticipant.unpublishTrack(this.localAudioTrack);
      this.localAudioTrack.stop();
    } catch (e) {
      console.error("Error stopping track after remote mute:", e);
    } finally {
      this.localAudioTrack = null;
    }
  }
}
 async toggleMic(): Promise<void>
  {
    const video = this.videoPlayer?.nativeElement;

// If turning mic ON → mute HLS audio
if (!this.isMicOn && video) {
  video.muted = true;
  video.volume = 0;
}

// If turning mic OFF → restore HLS audio
if (this.isMicOn && video) {
  video.muted = false;
  video.volume = 1;
}

  if (  this.isPublishing) return;
debugger
  const localParticipant = this.room.localParticipant;
// 🔒 STEP-1: Prevent audio feedback loop


  // 🚫 Admin hard mute check
  if (!localParticipant.permissions?.canPublish) {
    alert('❌ You are muted by the teacher.');
    return;
  }

  this.isPublishing = true;

  try {
    // 🎙️ MIC ON
    if (!this.isMicOn) 
      {

      // Clean up ONLY your own track
      if (this.localAudioTrack)
         {
        try {
          await localParticipant.unpublishTrack(this.localAudioTrack);
          this.localAudioTrack.stop();
        } catch {}
        this.localAudioTrack = undefined!;
      }

      // Create fresh mic
      this.localAudioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });

      await localParticipant.publishTrack(this.localAudioTrack);

      this.isMicOn = true;
      console.log('🎙️ Mic ON');
    }

    // 🔇 MIC OFF
    else {
      if (this.localAudioTrack) {
        await localParticipant.unpublishTrack(this.localAudioTrack);
        this.localAudioTrack.stop();
        this.localAudioTrack = undefined!;
      }

      this.isMicOn = false;
      console.log('🔇 Mic OFF');
    }

  } catch (err) {
    console.error('Mic toggle failed:', err);
  } finally {
    this.isPublishing = false;
  }
}


  ngOnDestroy() {
    // 3. CRITICAL: Cleanup to prevent listener leaks on HMR reload
    if (this.hls) this.hls.destroy();
    if (this.room) {
      this.room.disconnect();
    }
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
    }
  }


  sendMessage(): void {
  if (!this.chatInput.trim()) return;

  this.chatMessages.push({
    sender: 'You',
    text: this.chatInput.trim(),
    time: new Date()
  });

  this.chatInput = '';
}

 async forceResetMicrophone() {
  try {
    const localParticipant = this.room.localParticipant;

    // 🔥 Unpublish all existing audio tracks safely
    const audioPublications = Array.from(
      localParticipant.audioTrackPublications.values()
    );

    for (const pub of audioPublications) {
      if (pub.track) {
        await localParticipant.unpublishTrack(pub.track);
        pub.track.stop();
      }
    }

    // 🎙️ Create a fresh audio track
    this.localAudioTrack = await createLocalAudioTrack({
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    });

    // 🚀 Publish fresh track
    await localParticipant.publishTrack(this.localAudioTrack);

    this.isMicOn = true;
    console.log('🎙️ Fresh audio track published');

  } catch (err) {
    console.error('Failed to restart mic automatically:', err);
    this.isMicOn = false;
  }
}



GetOngoingClass()
{
  this.mycourses.GetOngoingClass().subscribe({
    next: (response: any) => 
      {
        let data = response.result;
         this.classannouncement = data.filter((item: any) => item.courseId == this.CourseId && item.chatroom_id == this.ChatroomId);
     
     this.streamUrl = this.classannouncement[0]?.HlsPlaybackUrl || '';
        console.log('Ongoing Class:', this.classannouncement);
    },error: (error: any) => {
      console.error('Error fetching ongoing class:', error);
    }

  })
}



}