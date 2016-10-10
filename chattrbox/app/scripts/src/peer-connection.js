require('webrtc-adapter');

var config = {iceServers:[{url:"stun:stun.l.google.com:19302"}]};
var connection = {
  optional: [{DtlsSrtpKeyAgreement: true}]
};

var initDataChannel = pc => {
  return pc.createDataChannel('RTCDataChannel', { reliable: true });
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

var negotiate = () => {
  var iced = false;

  var pc = new RTCPeerConnection(config, connection);

  var description = () => {
    return new Promise((resolve) => {
      if (iced) {
        resolve(pc.localDescription);
        return;
      }
      pc.onicecandidate = e => {
        if (e.candidate == null) {
          iced = true;
          resolve(pc.localDescription);
        }
      };
    });
  };

  var createOffer = () => {
    pc.createOffer().then(desc => {
      pc.setLocalDescription(desc);
    });

    return description();
  };

  var createAnswer = () => {
    pc.createAnswer().then(answer => {
      pc.setLocalDescription(answer);
    });

    return description();
  };

  return {
    pc,
    createOffer,
    createAnswer,
    description
  };
};

var outgoingChannel = (pc) => {
  return new Promise((resolve) => {
    var channel = initDataChannel(pc);

    channel.onopen = e => {
      resolve(channel);
    };
  });
};

var incomingChannel = (pc) => {
  return new Promise((resolve) => {
    pc.ondatachannel = e => {
      resolve(e.channel || e);
    };
  });
};

var outgoing = async ({ send, awaitReply }, { pc, createOffer }, userId) => {
  var offer = await createOffer();
  send(userId, offer);
  var answer = await awaitReply(userId);
  pc.setRemoteDescription(answer);
};

var incoming = async ({ send }, { pc, createAnswer }, userId, offer) => {
  pc.setRemoteDescription(offer);
  var answer = await createAnswer(pc);
  send(userId, answer);
};

export async function start(signal, userId, offer) {
  var negotiable = negotiate();
  var { pc } = negotiable;

  var localPromise = initLocalStream(pc);
  var remotePromise = initRemoteStream(pc);
  var channelPromise = offer ? incomingChannel(pc) : outgoingChannel(pc);

  var localStream = await localPromise;

  (offer ? incoming : outgoing)(signal, negotiable, userId, offer);

  var remoteStream = await remotePromise;
  var channel = await channelPromise;

  return {
    localStream,
    remoteStream,
    channel
  };
};
