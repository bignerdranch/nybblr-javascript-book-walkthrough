var config = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]};
var connection = {
  'optional': [{'DtlsSrtpKeyAgreement': true}]
};

var initDataChannel = pc => {
  return pc.createDataChannel('RTCDataChannel', { reliable: true });
};

var negotiate = () => {
  var iced = false;

  var pc = new RTCPeerConnection(config, connection);

  var description = () => {
    return new Promise((resolve, reject) => {
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

  description();

  return {
    pc,
    createOffer,
    createAnswer,
    description
  };
};

export function start({ send, awaitReply }, userId) {
  var {
    pc,
    createOffer,
    createAnswer,
    description
  } = negotiate();

  return new Promise((resolve, reject) => {
    var channel = initDataChannel(pc);

    channel.onopen = e => {
      resolve(channel);
    };

    createOffer(pc).then(offer => {
      send(userId, offer);
      awaitReply(userId).then(answer => {
        pc.setRemoteDescription(answer);
      }, reject);
    }, reject);
  });
};

export function receive({ send, awaitReply }, { from: userId, msg: offer }) {
  var {
    pc,
    createOffer,
    createAnswer,
    description
  } = negotiate();

  return new Promise((resolve, reject) => {
    pc.ondatachannel = e => {
      var channel = e.channel || e;
      resolve(channel);
    };

    pc.setRemoteDescription(offer);
    createAnswer(pc).then(answer => {
      send(userId, answer);
    }, reject);
  });
}
