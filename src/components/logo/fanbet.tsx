"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Skeleton } from "../ui/skeleton";

type Props = {
  height?: string;
  width?: string;
};

export default function FanbetLogo({ height, width }: Props) {
  const [mounted, setMounted] = useState(false);
  const [stroke, setStroke] = useState<"black" | "white">("black");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(() => true);

    if (resolvedTheme === "light") {
      setStroke("black");
    } else if (resolvedTheme === "dark") {
      setStroke("white");
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return <Skeleton className={`h-10 w-40 p-4`} />;
  }

  return (
    <svg
      height={height ?? "588"}
      width={width ?? "699"}
      viewBox="0 0 588 699"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="294"
        cy="294"
        r="286.759"
        stroke={stroke}
        strokeWidth="14.4828"
      />
      <circle
        cx="292.551"
        cy="292.552"
        r="265.035"
        stroke={stroke}
        strokeWidth="14.4828"
      />
      <circle cx="293.999" cy="294" r="94.1379" fill="black" />
      <g filter="url(#filter0_d_456_17)">
        <path
          d="M192.811 86.2095L242.228 205.348C243.569 208.58 247.443 209.882 250.563 208.298C269.377 198.753 289.164 195.182 311.322 199.591C315.042 200.331 318.658 197.606 318.696 193.813L320.025 63.3195C320.051 60.7982 318.428 58.5395 316.024 57.7774C263.474 41.1143 235.588 46.3691 194.493 79.5418C192.514 81.1387 191.836 83.8611 192.811 86.2095Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter1_d_456_17)">
        <path
          d="M399.635 87.5652L333.799 198.479C332.013 201.488 333.291 205.37 336.427 206.921C355.337 216.274 370.044 229.984 379.78 250.372C381.414 253.795 385.762 255.059 388.823 252.819L494.137 175.752C496.172 174.263 497.009 171.611 496.18 169.23C478.062 117.162 457.157 97.9737 405.983 84.9204C403.519 84.2921 400.933 85.379 399.635 87.5652Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter2_d_456_17)">
        <path
          d="M523.319 249.193L395.39 265.631C391.919 266.077 389.647 269.475 390.357 272.901C394.633 293.56 392.89 313.591 382.823 333.816C381.133 337.212 382.814 341.416 386.464 342.448L512.04 377.958C514.467 378.644 517.072 377.67 518.438 375.551C548.301 329.211 550.545 300.923 529.312 252.566C528.29 250.238 525.841 248.869 523.319 249.193Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter3_d_456_17)">
        <path
          d="M480.003 431.375L381.118 348.562C378.436 346.316 374.399 346.952 372.363 349.798C360.091 366.958 344.195 379.27 322.507 385.601C318.866 386.663 316.919 390.751 318.637 394.132L377.768 510.468C378.911 512.715 381.394 513.968 383.877 513.533C438.18 504.023 460.481 486.476 481.593 438.066C482.609 435.735 481.952 433.008 480.003 431.375Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter4_d_456_17)">
        <path
          d="M311.513 524.512L309.431 395.548C309.374 392.049 306.251 389.413 302.767 389.736C281.76 391.685 262.049 387.72 243.07 375.463C239.884 373.405 235.519 374.607 234.086 378.119L184.807 498.958C183.855 501.292 184.532 503.99 186.486 505.583C229.211 540.424 257.072 545.805 307.494 530.092C309.922 529.336 311.554 527.054 311.513 524.512Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter5_d_456_17)">
        <path
          d="M127.748 455.542L225.4 371.28C228.049 368.994 228.071 364.907 225.589 362.44C210.629 347.565 201.037 329.894 198.281 307.47C197.818 303.705 194.097 301.125 190.483 302.277L66.1456 341.908C63.7433 342.673 62.107 344.923 62.1364 347.444C62.7803 402.569 76.5089 427.404 120.889 456.034C123.025 457.412 125.823 457.203 127.748 455.542Z"
          fill={stroke}
        />
      </g>
      <g filter="url(#filter6_d_456_17)">
        <path
          d="M65.3997 252.601L190.749 282.993C194.15 283.817 197.486 281.457 198.049 278.003C201.442 257.182 210.232 239.098 226.866 223.809C229.658 221.242 229.591 216.715 226.552 214.446L121.975 136.382C119.954 134.874 117.173 134.852 115.14 136.343C70.6808 168.941 58.471 194.556 61.0087 247.309C61.1309 249.848 62.9289 252.002 65.3997 252.601Z"
          fill={stroke}
        />
      </g>
      <circle cx="292.551" cy="292.552" r="8.68966" fill="#E6E6E6" />
      <path
        d="M129.3 659.5H162.9V672.5H129.3V659.5ZM130.5 698H114.3V628H167.2V641H130.5V698ZM208.505 698V687.5L207.505 685.2V666.4C207.505 663.067 206.471 660.467 204.405 658.6C202.405 656.733 199.305 655.8 195.105 655.8C192.238 655.8 189.405 656.267 186.605 657.2C183.871 658.067 181.538 659.267 179.605 660.8L174.005 649.9C176.938 647.833 180.471 646.233 184.605 645.1C188.738 643.967 192.938 643.4 197.205 643.4C205.405 643.4 211.771 645.333 216.305 649.2C220.838 653.067 223.105 659.1 223.105 667.3V698H208.505ZM192.105 698.8C187.905 698.8 184.305 698.1 181.305 696.7C178.305 695.233 176.005 693.267 174.405 690.8C172.805 688.333 172.005 685.567 172.005 682.5C172.005 679.3 172.771 676.5 174.305 674.1C175.905 671.7 178.405 669.833 181.805 668.5C185.205 667.1 189.638 666.4 195.105 666.4H209.405V675.5H196.805C193.138 675.5 190.605 676.1 189.205 677.3C187.871 678.5 187.205 680 187.205 681.8C187.205 683.8 187.971 685.4 189.505 686.6C191.105 687.733 193.271 688.3 196.005 688.3C198.605 688.3 200.938 687.7 203.005 686.5C205.071 685.233 206.571 683.4 207.505 681L209.905 688.2C208.771 691.667 206.705 694.3 203.705 696.1C200.705 697.9 196.838 698.8 192.105 698.8ZM269.923 643.4C274.19 643.4 277.99 644.267 281.323 646C284.723 647.667 287.39 650.267 289.323 653.8C291.257 657.267 292.223 661.733 292.223 667.2V698H276.623V669.6C276.623 665.267 275.657 662.067 273.723 660C271.857 657.933 269.19 656.9 265.723 656.9C263.257 656.9 261.023 657.433 259.023 658.5C257.09 659.5 255.557 661.067 254.423 663.2C253.357 665.333 252.823 668.067 252.823 671.4V698H237.223V644.2H252.123V659.1L249.323 654.6C251.257 651 254.023 648.233 257.623 646.3C261.223 644.367 265.323 643.4 269.923 643.4ZM307.464 698V628H341.664C350.464 628 357.064 629.667 361.464 633C365.931 636.333 368.164 640.733 368.164 646.2C368.164 649.867 367.264 653.067 365.464 655.8C363.664 658.467 361.197 660.533 358.064 662C354.931 663.467 351.331 664.2 347.264 664.2L349.164 660.1C353.564 660.1 357.464 660.833 360.864 662.3C364.264 663.7 366.897 665.8 368.764 668.6C370.697 671.4 371.664 674.833 371.664 678.9C371.664 684.9 369.297 689.6 364.564 693C359.831 696.333 352.864 698 343.664 698H307.464ZM323.564 685.8H342.464C346.664 685.8 349.831 685.133 351.964 683.8C354.164 682.4 355.264 680.2 355.264 677.2C355.264 674.267 354.164 672.1 351.964 670.7C349.831 669.233 346.664 668.5 342.464 668.5H322.364V656.7H339.664C343.597 656.7 346.597 656.033 348.664 654.7C350.797 653.3 351.864 651.2 351.864 648.4C351.864 645.667 350.797 643.633 348.664 642.3C346.597 640.9 343.597 640.2 339.664 640.2H323.564V685.8ZM409.529 698.8C403.396 698.8 397.996 697.6 393.329 695.2C388.729 692.8 385.162 689.533 382.629 685.4C380.096 681.2 378.829 676.433 378.829 671.1C378.829 665.7 380.062 660.933 382.529 656.8C385.062 652.6 388.496 649.333 392.829 647C397.162 644.6 402.062 643.4 407.529 643.4C412.796 643.4 417.529 644.533 421.729 646.8C425.996 649 429.362 652.2 431.829 656.4C434.296 660.533 435.529 665.5 435.529 671.3C435.529 671.9 435.496 672.6 435.429 673.4C435.362 674.133 435.296 674.833 435.229 675.5H391.529V666.4H427.029L421.029 669.1C421.029 666.3 420.462 663.867 419.329 661.8C418.196 659.733 416.629 658.133 414.629 657C412.629 655.8 410.296 655.2 407.629 655.2C404.962 655.2 402.596 655.8 400.529 657C398.529 658.133 396.962 659.767 395.829 661.9C394.696 663.967 394.129 666.433 394.129 669.3V671.7C394.129 674.633 394.762 677.233 396.029 679.5C397.362 681.7 399.196 683.4 401.529 684.6C403.929 685.733 406.729 686.3 409.929 686.3C412.796 686.3 415.296 685.867 417.429 685C419.629 684.133 421.629 682.833 423.429 681.1L431.729 690.1C429.262 692.9 426.162 695.067 422.429 696.6C418.696 698.067 414.396 698.8 409.529 698.8ZM467.915 698.8C461.582 698.8 456.648 697.2 453.115 694C449.582 690.733 447.815 685.9 447.815 679.5V632.3H463.415V679.3C463.415 681.567 464.015 683.333 465.215 684.6C466.415 685.8 468.048 686.4 470.115 686.4C472.582 686.4 474.682 685.733 476.415 684.4L480.615 695.4C479.015 696.533 477.082 697.4 474.815 698C472.615 698.533 470.315 698.8 467.915 698.8ZM439.515 657.4V645.4H476.815V657.4H439.515Z"
        fill={stroke}
      />
      <defs>
        <filter
          id="filter0_d_456_17"
          x="192.371"
          y="39.8929"
          width="156.62"
          height="189.354"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_456_17"
          x="332.986"
          y="76.0542"
          width="192.475"
          height="198.163"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_d_456_17"
          x="382.164"
          y="240.457"
          width="190.155"
          height="157.995"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter3_d_456_17"
          x="318.006"
          y="338.517"
          width="193.026"
          height="195.378"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter4_d_456_17"
          x="184.381"
          y="365.767"
          width="156.098"
          height="192.989"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter5_d_456_17"
          x="62.1367"
          y="293.311"
          width="194.249"
          height="183.908"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
        <filter
          id="filter6_d_456_17"
          x="60.6914"
          y="126.548"
          width="197.173"
          height="176.886"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14.4828" dy="5.7931" />
          <feGaussianBlur stdDeviation="7.24138" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_456_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_456_17"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
