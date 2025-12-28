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

@Component({
  selector: 'app-classroom',
  standalone: false,
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css',
})
export class ClassroomComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  private streamUrl: string = 'https://drbagchisclasses.b-cdn.net/1234/index.m3u8';
  
  room!: Room;
  localAudioTrack: LocalAudioTrack | null = null;
  isMicOn: boolean = false;
  isJoined: boolean = false; // Controls the overlay
  chatInput:any = ''
  private hls: Hls | null = null;
chatMessages:any = [];

  constructor(private ngZone: NgZone) {}

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

async connectToLiveKit(): Promise<void> 
{
    try {
      const identity = 'student_' + Math.floor(Math.random() * 10000);
      const res = await fetch('http://localhost:8080/api/guest/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, room: 'class_2025' })
      });
      const data = await res.json();

      this.room = new Room();
      
      // Clean up on disconnect
      this.room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit');
      });

            // Inside connectToLiveKit()
                // Inside connectToLiveKit()
     // Inside connectToLiveKit()
this.room.on(RoomEvent.ParticipantMetadataChanged, (metadata: any, participant) => {
  if (participant.identity === this.room.localParticipant.identity) {
    try {
      const data = JSON.parse(metadata);
      
      this.ngZone.run(async () => {
        if (data.micLocked === false && this.isHardLocked === true) {
          // 1. Clear the hard lock state
          this.isHardLocked = false;
          
          // 2. CRITICAL: If the mic was "on" when locked, we must reset it
          if (this.isMicOn) {
            console.log("Permissions restored. Restarting audio stream...");
            await this.forceResetMicrophone();
          }
          
          alert("Your microphone is now unlocked. You can speak now.");
        } else if (data.micLocked === true) {
          this.isHardLocked = true;
          this.isMicOn = false;
          // Stop current track so the "red light" goes off
          if (this.localAudioTrack) {
            this.localAudioTrack.stop();
            this.localAudioTrack = null;
          }
        }
      });
    } catch (e) { console.error(e); }
  }
});

      await this.room.connect('ws://localhost:7880', data.token);
      console.log('Connected to LiveKit:', identity);
    } catch (e) {
      console.error('LiveKit connection failed', e);
    }
}

 async toggleMic(): Promise<void> {
  if (!this.room || this.isPublishing) return;

  const localParticipant = this.room.localParticipant;

  // 🚫 HARD MUTE CHECK (Muted for everyone by admin)
  if (!localParticipant.permissions?.canPublish) {
    alert('❌ You are muted by the teacher. Mic access is disabled.');
    return;
  }

  this.isPublishing = true;

  try {
    // 🎙️ MIC ON
    if (!this.isMicOn) {

      if (!this.localAudioTrack) {
        this.localAudioTrack = await createLocalAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        });

        await localParticipant.publishTrack(this.localAudioTrack);
      }

      await this.localAudioTrack.unmute();
      this.isMicOn = true;
      console.log('🎙️ Mic ON');

    } 
    // 🔇 MIC OFF
    else {
      if (this.localAudioTrack) {
        await this.localAudioTrack.mute();
      }

      this.isMicOn = false;
      console.log('🔇 Mic OFF');
    }

  } catch (error) {
    console.error('Mic toggle error:', error);
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


}