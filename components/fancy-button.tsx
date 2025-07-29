"use client"

interface FancyButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode; // Add an icon prop
}

export default function FancyButton({ children, icon }: FancyButtonProps) {
  return (
    // The main container that establishes the group for hover effects
    <div className="group relative w-[150px] h-[66px]"> {/* Increased width for longer text */}
      {/* Hidden SVG filters for the blur and color effects */}
      <svg className="absolute w-0 h-0">
        <filter id="unopaq" width="300%" x="-100%" height="300%" y="-100%">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 9 0"
          />
        </filter>
        <filter id="unopaq2" width="300%" x="-100%" height="300%" y="-100%">
           <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 3 0"
          />
        </filter>
         <filter id="unopaq3" width="300%" x="-100%" height="300%" y="-100%">
           <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0.2 0
                    0 1 0 0.2 0
                    0 0 1 0.2 0
                    0 0 0 2 0"
          />
        </filter>
      </svg>
      
      {/* This is the invisible, clickable button layer */}
      <button className="absolute inset-0 w-full h-full z-30 cursor-pointer opacity-0" />
      
      {/* This container clips all visual effects */}
      <div 
        className="relative h-full w-full overflow-hidden"
        style={{ clipPath: 'path("M 110 0 C 141 0 146 5 146 33 C 146 61 141 66 110 66 L 33 66 C 5 66 0 61 0 33 C 0 5 5 0 33 0 Z")' }} // Adjusted clip path for width
      >
        {/* The dark backdrop */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Intense blurred spin for the outer glow */}
        <div className="absolute inset-0 z-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100 [filter:blur(2em)_url(#unopaq)]">
          <div className="animate-speen [animation-play-state:paused] group-hover:[animation-play-state:running] absolute inset-[-150%] bg-gradient-to-r from-[#f50] via-transparent to-[#05f]" />
        </div>

        {/* Sharper spin for the inner glow */}
        <div className="absolute inset-[-0.125em] z-0 rounded-[0.75em] opacity-50 transition-opacity duration-300 group-hover:opacity-100 [filter:blur(0.25em)_url(#unopaq2)]">
          <div className="animate-speen [animation-play-state:paused] group-hover:[animation-play-state:running] absolute inset-[-150%] bg-gradient-to-r from-[#f95] via-transparent to-[#59f]" />
        </div>

        {/* The main button structure with its padding acting as a border */}
        <div className="relative h-full w-full p-[3px]">
           {/* Subtle spin inside the border */}
           <div className="absolute inset-[-2px] z-10 rounded-[inherit] [filter:blur(2px)_url(#unopaq3)]">
             <div className="animate-speen [animation-play-state:paused] group-hover:[animation-play-state:running] absolute inset-[-150%] bg-gradient-to-r from-[#fc9] via-transparent to-[#9cf]" />
           </div>

          {/* The inner button content area with its own shape */}
          <div 
            className="relative z-20 w-full h-full bg-[#111215] text-white flex items-center justify-center text-base font-bold overflow-hidden"
            style={{ clipPath: 'path("M 110 0 C 135 0 140 5 140 30 C 140 55 135 60 110 60 L 30 60 C 5 60 0 55 0 30 C 0 5 5 0 30 0 Z")' }} // Adjusted clip path for width
          >
            {/* Subtle background glow that moves with the animation */}
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <div className="animate-speen [animation-play-state:paused] group-hover:[animation-play-state:running] absolute inset-[-150%] bg-gradient-to-r from-red-500/80 via-transparent to-blue-500/80" />
            </div>

            {/* Content (icon and text) is now in a separate container to stay on top */}
            <div className="relative z-10 flex items-center">
              {icon} {/* Render the passed icon */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
