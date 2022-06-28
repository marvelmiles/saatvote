import { forwardRef } from "react";
import { Box, Slide } from "@mui/material";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import PhotoAlb from "react-photo-album";
import { range } from "../helpers";

export const SlideUp = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export const ImageGallery = () => (
  <Gallery id="my-gallery">
    <Item
      //   original="https://placekitten.com/1024/768?image=1"
      thumbnail="C:\Users\Marvellous\Pictures\Screenshots\Screenshot (1).png"
      width="1024"
      height="768"
      alt=""
    >
      {({ ref, open }) => (
        <img
          alt=""
          ref={ref}
          onClick={open}
          src="https://placekitten.com/80/60?image=1"
        />
      )}
    </Item>
    <Item
      original="https://placekitten.com/1024/768?image=2"
      thumbnail="https://placekitten.com/80/60?image=2"
      width="1024"
      height="768"
      alt=""
    >
      {({ ref, open }) => (
        <img
          alt=""
          ref={ref}
          onClick={open}
          src="https://placekitten.com/80/60?image=2"
        />
      )}
    </Item>
  </Gallery>
);

const photos = [
  {
    src: "C:\\Users\\Marvellous\\Pictures\\Screenshots\\Screenshot (1).png",
    width: 800,
    height: 600,
  },
  {
    src: "C:\\Users\\Marvellous\\Pictures\\Screenshots\\Screenshot (1).png",
    width: 1600,
    height: 900,
  },
];

export const PhotoAlbum = () => <PhotoAlb layout="masonry" photos={photos} />;

export const SlideLeft = (props) => {
  return <Slide {...props} direction="right" />;
};

export const LoadingBall = ({ nBall = 3, sx = {}, delayFn }) => {
  const items = range(nBall);
  delayFn = delayFn || ((k) => k / 6 + "s");
  const ballStyle = {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, .5)",
    animation: " ball .45s cubic-bezier(0, 0, 0.15, 1) alternate infinite",
    display: "inline-block",
    mx: "2px",
    "@keyframes ball": {
      from: {
        transform: "translateY(5px)",
      },
      to: {
        transform: "translateY(-8px)",
      },
    },
  };
  return (
    <>
      {items.map((k) => (
        <Box
          key={k}
          sx={{
            ...ballStyle,
            ...sx,
            animationDelay: delayFn(k),
          }}
        />
      ))}
    </>
  );
};

export const CircularProgress = ({
  textColor = "primary.main",
  text,
  ...rest
}) => {
  return <Box>spinerrr</Box>;
};
