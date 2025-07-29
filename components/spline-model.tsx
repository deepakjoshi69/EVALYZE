"use client";

// It's best practice to use the standard import when dynamically loading
import Spline from '@splinetool/react-spline';

export default function SplineModel() {
  return (
    // The Spline component will fill the container it's placed in
    <Spline scene="https://prod.spline.design/Sb3GN0IPmWJxjfeL/scene.splinecode" />
  );
}
