import { useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";

// Popper

const Poppers = ({
  children,
  anchorEl,
  clippingParent,
  open,
  onClipBoundary = () => {},
  modify = {},
  rootBoundary,
  placement = "bottom",
}) => {
  // const [_open, _setOpen] = useState(false);
  const popperRef = useRef();
  const rootRef = useRef();
  const debounce = (fn, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), timeout);
    };
  };
  const setPosition = (targetEl, anchorsEl) => {
    console.log("setposition...");
    const aeRect = targetEl.getBoundingClientRect();
    anchorsEl.style.top = aeRect.top + targetEl.clientHeight + "px";
    anchorsEl.style.left = aeRect.left + "px";
  };
  const calc = useCallback(
    (_containerScroll = true) => {
      if (anchorEl && clippingParent) {
        const aeRect = anchorEl.getBoundingClientRect();
        const cpRect = clippingParent.getBoundingClientRect();
        const p = popperRef.current;
        const pRect = p.getBoundingClientRect();
        const pTop = pRect.top;
        const aeTop = aeRect.top;
        const aeLeft = aeRect.left;
        const cpTop = cpRect.top;
        const cpRight = cpRect.right;
        const pWidth = p.clientWidth;
        // var rect = el.getBoundingClientRect();
        // var elemTop = rect.top;
        // var elemBottom = rect.bottom;

        // // Only completely visible elements return true:
        // var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        // // Partially visible elements return true:
        // //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        // return isVisible;

        const detectOverflow = (
          element,
          container,
          fullyInView,
          options = {}
        ) => {
          // // starting point worked with emoji element
          // const isContained = _containerScroll && container.contains(element);
          // const contRect = container.getBoundingClientRect();
          // const elemRect = element.getBoundingClientRect();
          // const r = rootRef.current;
          // const rRect = rootRef.current.getBoundingClientRect();
          // const elemBottom = isContained ? element.offsetTop : elemRect.top;
          // const contTop = isContained ? container.scrollTop : contRect.top;
          // const contBottom = isContained
          //   ? contTop + container.clientHeight
          //   : contRect.bottom;
          // let rootBottom = r.clientHeight + r.offsetTop - 5;
          // const rootTop = rootRef.current.offsetTop;
          // const elemTop = isContained
          //   ? element.offsetTop
          //   : element.clientHeight;
          // const isBottom = isContained
          //   ? elemRect.top >= rootBottom || elemTop >= contBottom
          //   : elemBottom >= contBottom || elemBottom >= rootBottom;
          // const isTop = isContained
          //   ? elemTop + element.clientHeight <= contTop // elemTop <= rootTop || elemTop <= contTop
          //   : elemRect.top <= 10 || elemRect.top <= rRect.top;

          // starting point worked with popper element
          const isContained = _containerScroll && container.contains(element);
          const contRect = container.getBoundingClientRect();
          const elemRect = element.getBoundingClientRect();
          const r = rootRef.current;
          const rRect = rootRef.current.getBoundingClientRect();
          const elemBottom = isContained ? element.offsetTop : elemRect.bottom;
          const contTop = isContained ? container.scrollTop : contRect.top;
          const contBottom = isContained
            ? contTop + container.clientHeight
            : contRect.bottom;
          let rootBottom = isContained
            ? r.clientHeight + r.offsetTop - 5
            : rRect.bottom;
          const rootTop = rootRef.current.offsetTop;
          const elemTop = isContained
            ? element.offsetTop
            : element.clientHeight;
          const isBottom = isContained
            ? elemRect.top >= rootBottom || elemTop >= contBottom
            : elemBottom >= contBottom || elemBottom >= rootBottom;
          const isTop = isContained
            ? elemTop + element.clientHeight <= contTop // elemTop <= rootTop || elemTop <= contTop
            : elemRect.top <= rRect.top || elemRect.top <= contRect.top;

          let textContent = `
             offetTop= ${element.offsetTop}
             contTop= ${contTop}
             elemHeight= ${element.clientHeight}
             elemTop= ${elemTop}
             elemRectBot= ${elemRect.bottom}
            elemRectTop=  ${elemRect.top} fff`;
          textContent += `
              elemBot= ${elemBottom} 
                 rootBOT= ${rootBottom} 
                 CONTbOT= ${contBottom}
                 ELEMtOP= ${elemTop}
                 CONTtOP= ${contTop}
                 ROOTtOP= ${rootTop}
                 rootRectTop= ${rRect.top}
                 rootOffset= ${r.offsetTop}
                 rootHeight= ${r.clientHeight}
                 contoff= ${container.offsetTop}
                 contRect=${contRect.top}
                  ${isContained + " " + element.className}
                  ${!isTop && !isBottom} ${isTop} ${isBottom}
              `;
          console.log(
            element.offsetTop,
            contTop,
            element.clientHeight + elemTop,
            elemRect.bottom,
            elemRect.top,
            "ff"
          );

          console.log(
            elemBottom,
            rootBottom,
            contBottom,
            elemTop,
            contTop,
            rootTop,
            _containerScroll + element.className,
            !isTop && !isBottom,
            isTop,
            isBottom
          );
          console.log(element);
          document.querySelector("#stat").textContent = textContent;
          return {
            rootBottom,
            isTop,
            isBottom,
            isView: !isTop && !isBottom,
          };

          // same issue below
          // const rect = element.getBoundingClientRect();
          // const elemTop = rect.top;
          // const elemBottom = rect.bottom;
          // return fullyInView
          //   ? elemTop >= 0 && elemBottom >= 0
          //   : elemTop < container.clientHeight && elemBottom >= 0;

          // works if a child of container
          // const contViewTop = container.scrollTop;
          // const contViewBottom = contViewTop + container.clientHeight;
          // const elemTop = element.offsetTop;
          // const elemBottom = elemTop + element.clientHeight;
          // return fullyInView
          //   ? elemBottom < contViewBottom && elemTop > contViewTop
          //   : elemBottom <= contViewBottom && elemTop >= contViewTop;
        };

        //  bottom
        // p.style.top = anchorEl.offsetTop + anchorEl.clientHeight + "px";

        // top use offsetTop if popper is a child of cp else rect top same rule apply to left
        // p.style.transform = `translateY(${
        //   aeRect.top + anchorEl.clientHeight + "px"
        // })`;
        setPosition(anchorEl, popperRef.current);

        const { isTop, isBottom, isView } = detectOverflow(p, clippingParent);
        if (isTop && !isView) {
          document.querySelector("#tyui").textContent = "isTop";
          console.log("isTop overfflowed...");
        } else if (isBottom && !isView) {
          document.querySelector("#tyui").textContent = "isBottom";
          // onClipBoundary({ isBottom, isTop, isView });
          console.log("isBottom overflowed...");
        } else {
          document.querySelector("#tyui").textContent = "isView";
          console.log("is view...");
        }
        // if (isBottom) {
        //   console.log("overflowed bottom...");
        //   onClipBoundary("horizontal");
        // } else if (!isTop) {
        //   console.log("overflowed top...");
        //   const {
        //     preventOverflow: {
        //       placementFallback = "bottom",
        //       forcePopperScroll = true,
        //     },
        //   } = modify;
        //   if (placementFallback === "bottom") {
        //     const bottom = anchorEl.offsetTop + anchorEl.clientHeight + "px";
        //     console.log(bottom, rootBottom);
        //   }
        //   // p.style.top = aeRect.top - anchorEl.clientHeight / 2 + "px";
        //   // p.style.left = aeRect.left - 30 + "px";
        // }
        // if (aeTop > cpTop) {
        //   let top = aeRect.bottom;
        //   console.log(top, "tyu");
        //   p.style.top = top + "px";
        // } else {
        //   p.style.top = aeTop - 25 + "px";
        //   p.style.left =
        //     aeLeft + pWidth > cpRight
        //       ? aeLeft - pWidth + (cpRight - aeLeft - 10)
        //       : aeLeft - 10 + "px";
        // }
      }
    },
    [anchorEl, clippingParent]
  );
  useEffect(() => {
    if (clippingParent && anchorEl) {
      rootRef.current = rootBoundary || clippingParent.parentElement;
      // clippingParent.appendChild(popperRef.current);
      rootRef.current.addEventListener("scroll", calc.bind(this, false));
      clippingParent.addEventListener("scroll", calc.bind(this, true));
    }
  }, [clippingParent, anchorEl, calc, rootBoundary]);
  useEffect(() => {
    console.log(anchorEl);
    if (anchorEl && clippingParent) {
      calc();
      console.log("anchored started....");
    }
  }, [anchorEl, clippingParent, calc]);

  return (
    <>
      <Box
        sx={{
          display: open ? "block" : "none",
          position: "absolute",
          zIndex: 10,
        }}
        className="rty"
        ref={popperRef}
      >
        {children}
      </Box>
    </>
  );
};
