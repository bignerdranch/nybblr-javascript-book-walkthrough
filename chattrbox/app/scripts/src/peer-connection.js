require('webrtc-adapter');

var config = {iceServers:[{url:"stun:stun.l.google.com:19302"}]};

var description = pc => {
  return new Promise(resolve => {
    pc.onicecandidate = e => {
      if (!e.candidate) {
        resolve(pc.localDescription);
      }
    };
  });
};

var createOffer = pc => {
  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
  });

  return description(pc);
};

var createAnswer = pc => {
  pc.createAnswer().then(answer => {
    pc.setLocalDescription(answer);
  });

  return description(pc);
};

var outgoingChannel = pc => {
  return new Promise(resolve => {
    var channel = pc.createDataChannel('chat');

    channel.onopen = e => {
      resolve(channel);
    };
  });
};

var incomingChannel = pc => {
  return new Promise(resolve => {
    pc.ondatachannel = e => {
      resolve(e.channel || e);
    };
  });
};

var initLocalStream = async pc => {
  try {
    var stream = await navigator.mediaDevices
      .getUserMedia({ audio: true, video: true });
    pc.addStream(stream);
    return stream;
  } catch(e) {
    console.log(e);
  }
};

var initRemoteStream = pc => {
  return new Promise(resolve => {
    pc.onaddstream = ({ stream }) => resolve(stream);
  });
};

var outgoing = async ({ send, awaitReply }, pc, userId) => {
  var offer = await createOffer(pc);
  send(userId, offer);
  var answer = await awaitReply(userId);
  pc.setRemoteDescription(answer);
};

var incoming = async ({ send }, pc, userId, offer) => {
  pc.setRemoteDescription(offer);
  var answer = await createAnswer(pc);
  send(userId, answer);
};

export async function start(signal, userId, offer) {
  var pc = new RTCPeerConnection(config);

  var localPromise = initLocalStream(pc);
  var remotePromise = initRemoteStream(pc);
  var channelPromise = offer ? incomingChannel(pc) : outgoingChannel(pc);

  var local = await localPromise;

  (offer ? incoming : outgoing)(signal, pc, userId, offer);

  var remote = await remotePromise;
  var channel = await channelPromise;

  return {
    local,
    remote,
    channel
  };
};
