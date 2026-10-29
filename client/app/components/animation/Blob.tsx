import React from "react";

const Blob: React.FC = () => {
  return (
    <div className="absolute inset-0">
      {/* Main Blob */}
      <svg
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%">
              <animate
                attributeName="stop-color"
                values="hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456); hsla(239, 76%, 53%, 0.456);"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stop-opacity"
                values="1; 0.9; 0.8; 0.6; 0.5; 0.4; 1"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%">
              <animate
                attributeName="stop-color"
                values="hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0); hsla(0, 0%, 100%, 0);"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stop-opacity"
                values="1; 0.9; 0.8; 0.6; 0.5; 0.4; 1"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <path fill="url(#gradient)">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values={`
              M443,301.5Q392,353,352,396.5Q312,440,254,428.5Q196,417,143,391.5Q90,366,77,308Q64,250,62,181Q60,112,126,91Q192,70,258.5,44.5Q325,19,366.5,77Q408,135,451,192.5Q494,250,443,301.5Z;
              M423,320.5Q444,391,373.5,402.5Q303,414,251,411Q199,408,146.5,385.5Q94,363,57,306.5Q20,250,62.5,197Q105,144,152,119Q199,94,250.5,91.5Q302,89,353,113.5Q404,138,403,194Q402,250,423,320.5Z;
              M404,297.5Q381,345,347.5,396.5Q314,448,248.5,452Q183,456,144,405.5Q105,355,85.5,302.5Q66,250,85,197Q104,144,148.5,109.5Q193,75,253,65Q313,55,367,90.5Q421,126,424,188Q427,250,404,297.5Z;
              M443,301.5Q392,353,352,396.5Q312,440,254,428.5Q196,417,143,391.5Q90,366,77,308Q64,250,62,181Q60,112,126,91Q192,70,258.5,44.5Q325,19,366.5,77Q408,135,451,192.5Q494,250,443,301.5Z;
            `}
          />
        </path>
      </svg>
      {/* Glow Effect */}
      <div className="absolute inset-0 filter blur-[50px]">
        <svg
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="w-full h-full"
        >
          <path fill="url(#gradient)">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values={`
                M443,301.5Q392,353,352,396.5Q312,440,254,428.5Q196,417,143,391.5Q90,366,77,308Q64,250,62,181Q60,112,126,91Q192,70,258.5,44.5Q325,19,366.5,77Q408,135,451,192.5Q494,250,443,301.5Z;
                M423,320.5Q444,391,373.5,402.5Q303,414,251,411Q199,408,146.5,385.5Q94,363,57,306.5Q20,250,62.5,197Q105,144,152,119Q199,94,250.5,91.5Q302,89,353,113.5Q404,138,403,194Q402,250,423,320.5Z;
                M404,297.5Q381,345,347.5,396.5Q314,448,248.5,452Q183,456,144,405.5Q105,355,85.5,302.5Q66,250,85,197Q104,144,148.5,109.5Q193,75,253,65Q313,55,367,90.5Q421,126,424,188Q427,250,404,297.5Z;
                M443,301.5Q392,353,352,396.5Q312,440,254,428.5Q196,417,143,391.5Q90,366,77,308Q64,250,62,181Q60,112,126,91Q192,70,258.5,44.5Q325,19,366.5,77Q408,135,451,192.5Q494,250,443,301.5Z;
              `}
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

export default Blob;
