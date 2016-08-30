export var getJSON = async (url) => {
  var request = new Request(url, {
    method: 'GET',
    mode: 'same-origin',
    credentials: 'same-origin'
  });
  var response = await fetch(request);
  return await response.json();
};
