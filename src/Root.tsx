import React from "react";
import { Composition } from "remotion";
import { SejarahRengasdengklok, DURASI_RDK } from "./SejarahRengasdengklok";

export const Root: React.FC = () => (
  <Composition id="SejarahRengasdengklok" component={SejarahRengasdengklok} durationInFrames={DURASI_RDK} fps={30} width={1080} height={1920} />
);
