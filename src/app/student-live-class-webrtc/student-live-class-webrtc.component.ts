import { Component, ElementRef, ViewChild } from '@angular/core';
import { RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track } from 'livekit-client';
import { environment } from '../environments/environment.prod';
 
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

  isConnected = false;

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
    // 1. Get Token
    const res = await fetch(`${this.baseUrl}api/guest/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: 'class_123',
        identity: 'student_' + Math.floor(Math.random() * 10000)
      })
    });
    const data = await res.json();

    // 2. Setup Room
    this.room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    // 3. REGISTER HANDLERS BEFORE CONNECTING
  
if(data.token)
{ 
      this.registerTrackHandlers();

}
    // 4. CONNECT ONCE
    console.log('🔗 Connecting to LiveKit...');
    await this.room.connect(this.livekitUrl, data.token);
    // 5. Explicitly start audio now that we have a user gesture
    await this.room.startAudio();
    
    this.isConnected = true;
    console.log('✅ Student connected and audio started');

  } catch (err) {
    console.error('Join failed', err);
  }
}


registerTrackHandlers() {
  this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    console.log(`📥 Track Subscribed: ${publication.source} from ${participant.identity}`);

    if (track.kind === Track.Kind.Video) {
      const videoEl = this.teacherScreen.nativeElement;
      
      // Use LiveKit's built-in .attach() - it's much safer than manual MediaStream
      track.attach(videoEl);
      
      videoEl.play().catch(err => {
        console.warn('⚠️ Auto-play failed, usually requires a click:', err);
      });
    }

    if (track.kind === Track.Kind.Audio) {
      // Audio tracks also need to be attached to the DOM to be heard
      const audioElement = track.attach();
      document.body.appendChild(audioElement);
    }
  });

  // Log when teacher is already in room with tracks
  this.room.on(RoomEvent.ParticipantConnected, (p) => {
     console.log('Teacher/Participant joined:', p.identity);
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

    await this.room.connect(url, token);
    this.isConnected = true;
 


     this.room.on(
    RoomEvent.ParticipantMetadataChanged,
    (metadata, participant) => {

      // ONLY react to my own metadata
      if (participant.identity !== this.room.localParticipant.identity) return;

      try {
        const data = JSON.parse(metadata || '{}');

        if (data.micLocked === true) {
          console.log('🔇 Mic locked by admin');
          this.forceStopMicrophone();
        }

      } catch (e) {
        console.warn('Invalid metadata:', metadata);
      }
    }
  );

  // 🔒 ALSO listen for permission change (backup safety)
  this.room.on(
    RoomEvent.ParticipantPermissionsChanged,
    (permissions, participant) => {

      if (participant.identity !== this.room.localParticipant.identity) return;

      if (!permissions?.canPublish) {
        console.log('🔇 Publishing disabled by admin');
        this.forceStopMicrophone();
      }
    }
  );



    console.log('✅ Student connected to LiveKit');
  }

  async forceStopMicrophone() {

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

  joinClass_old() {
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

async toggleMic() {
  if (!this.room) return;

  const videoEl = this.teacherScreen?.nativeElement;

  // 🔇 TURN MIC OFF
  if (this.isMicOn && this.localAudioTrack) {
    await this.room.localParticipant.unpublishTrack(
      this.localAudioTrack
    );
    this.localAudioTrack.stop();
    this.localAudioTrack = null;
    this.isMicOn = false;

    // Resume teacher audio
    if (videoEl) {
      videoEl.muted = false;
    }

    console.log('🔇 Student mic OFF');
    return;
  }

  // 🎙️ TURN MIC ON
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  this.localAudioTrack = stream.getAudioTracks()[0];

  await this.room.localParticipant.publishTrack(
    this.localAudioTrack
  );

  this.isMicOn = true;

  // Mute teacher audio to avoid echo
  if (videoEl) {
    videoEl.muted = true;
  }

  console.log('🎙️ Student mic ON');
}


}
