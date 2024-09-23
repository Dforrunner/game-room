'use client';

interface Props {
  text: string;
  color?: string;
  duration?: string;
  delay?: string;
  fillOpacity?: number;
}
export default function AnimateTextStroke({
  text,
  color = 'rgba(197, 83, 253, 1)',
  duration = '1s',
  delay = '0',
  fillOpacity = 0.2,
}: Props) {
  return (
    <div
      className='svg-text-animation'
      style={
        {
          '--color': color,
          '--duration': duration,
          '--delay': delay,
          '--fill-opacity': fillOpacity,
        } as any
      }
    >
      <style jsx>
        {`
          .svg-text-animation {
            width: 100%;
          }
          .svg-text-animation svg {
            font-family: 'Russo One', sans-serif;
            width: 100%;
            height: 100%;
          }
          .svg-text-animation svg text {
            visibility: hidden;
            animation: stroke linear forwards;
            animation-duration: var(--duration);
            animation-delay: var(--delay);
            stroke-width: 2;
            stroke: var(--color);
            font-size: clamp(3.125rem, 1.6667rem + 6.2222vw, 7.5rem);
          }
          @keyframes stroke {
            0% {
              visibility: visible;
              fill: rgba(0, 0, 0, 0);
              stroke: var(--color);
              stroke-dashoffset: 25%;
              stroke-dasharray: 0 50%;
              stroke-width: 2;
            }
            70% {
              fill: rgba(0, 0, 0, 0);
              stroke: var(--color);
            }
            80% {
              fill: rgba(0, 0, 0, 0);
              stroke: var(--color);
              stroke-width: 3;
            }
            100% {
              visibility: visible;
              fill: var(--color);
              fill-opacity: var(--fill-opacity);
              stroke: var(--color);
              stroke-dashoffset: -25%;
              stroke-dasharray: 50% 0;
            }
          }
        `}
      </style>
      <svg>
        <text x='50%' y='50%' dy='.35em' textAnchor='middle'>
          {text}
        </text>
      </svg>
    </div>
  );
}
