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

  var channelPromise = offer ? incomingChannel(pc) : outgoingChannel(pc);

  (offer ? incoming : outgoing)(signal, pc, userId, offer);

  var channel = await channelPromise;

  return {
    channel
  };
};
