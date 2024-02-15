import storable from "./storable";

function createBackground() {
  const video = storable('', 'backgroundVideo');
  const image = storable('', 'backgroundImage');
  const transparency = storable(0.7, 'transparency');

  function resetAll() {
    image.set('');
    video.set('');
  }

  function setImage(url: string) {
    image.set(url);
    video.set('');
  }
  function setVideo(url: string) {
    image.set('');
    video.set(url);
  }

  return {
    video,
    image,
    transparency,
    resetAll,
    setVideo,
    setImage
  }
}

const background = createBackground();

export default background;
