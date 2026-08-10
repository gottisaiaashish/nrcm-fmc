import { useEffect, useRef, useMemo } from 'react';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    let wordKey = 0;

    const processNode = (node) => {
      if (typeof node === 'string') {
        return node.split(/(\s+)/).map((word) => {
          if (word.match(/^\s+$/)) return word;
          wordKey++;
          return (
            <span className="inline-block word" key={`w-${wordKey}`}>
              {word}
            </span>
          );
        });
      }

      if (React.isValidElement(node)) {
        const childContent = node.props.children;
        if (typeof childContent === 'string' && !childContent.trim().includes(' ')) {
          wordKey++;
          return React.cloneElement(node, {
            key: node.key || `w-${wordKey}`,
            className: `${node.props.className || ''} inline-block word`.trim()
          });
        }

        const processedChildren = React.Children.map(childContent, processNode);
        return React.cloneElement(node, {
          key: node.key || `el-${wordKey++}`,
          className: `${node.props.className || ''} inline-block`.trim(),
          children: processedChildren
        });
      }

      return node;
    };

    return React.Children.map(children, processNode);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;
