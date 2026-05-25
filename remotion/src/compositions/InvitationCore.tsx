import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import type { InvitationProps } from "../schema";
import { ThemeProvider } from "./ThemeContext";
import type { Theme } from "../themes";
import { FloralBorder } from "../components/FloralBorder";
import { Butterfly } from "../components/Butterfly";
import { Petals } from "../components/Petals";
import { FloralIntro } from "../scenes/FloralIntro";
import { HeaderScene } from "../scenes/HeaderScene";
import { BismillahScene } from "../scenes/BismillahScene";
import { CoupleScene } from "../scenes/CoupleScene";
import { DetailsScene } from "../scenes/DetailsScene";
import { OutroScene } from "../scenes/OutroScene";

const TIMELINE = {
  intro: { from: 0, dur: 90 },
  swirl: { from: 90, dur: 120 },
  header: { from: 210, dur: 150 },
  bismillah: { from: 360, dur: 150 },
  couple: { from: 510, dur: 150 },
  details: { from: 660, dur: 180 },
  outro: { from: 840, dur: 60 },
};

type Props = InvitationProps & { theme: Theme };

export const InvitationCore: React.FC<Props> = ({ theme, ...props }) => {
  const frame = useCurrentFrame();
  const borderOpacity = interpolate(frame, [60, 120], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const { palette } = theme;
  const spot = palette.spotlight;
  const spotlightStops = `radial-gradient(ellipse 70% 55% at 50% 50%, ${spot}F5 0%, ${spot}D9 45%, ${spot}00 90%)`;

  return (
    <ThemeProvider theme={theme}>
      <AbsoluteFill style={{ background: palette.bg }}>
        <Sequence from={TIMELINE.intro.from} durationInFrames={TIMELINE.intro.dur}>
          <FloralIntro />
        </Sequence>

        <Sequence from={60} durationInFrames={900 - 60}>
          <FloralBorder opacity={borderOpacity} />
        </Sequence>

        {theme.useCenterSpotlight && (
          <Sequence from={150} durationInFrames={900 - 150 - 30}>
            <AbsoluteFill style={{ background: spotlightStops }} />
          </Sequence>
        )}

        {theme.petals && (
          <Sequence from={120} durationInFrames={900 - 120}>
            <Petals count={22} />
          </Sequence>
        )}

        {theme.butterflies && (
          <>
            <Sequence from={150} durationInFrames={780}>
              <Butterfly delay={0} startX={-120} startY={180} endX={620} endY={120} size={150} hue="orange" />
            </Sequence>
            <Sequence from={300} durationInFrames={600}>
              <Butterfly delay={0} startX={760} startY={780} endX={120} endY={680} size={130} hue="pink" flapSpeed={5} />
            </Sequence>
            <Sequence from={540} durationInFrames={360}>
              <Butterfly delay={0} startX={-100} startY={900} endX={520} endY={780} size={140} hue="orange" flapSpeed={7} />
            </Sequence>
            <Sequence from={720} durationInFrames={180}>
              <Butterfly delay={0} startX={760} startY={300} endX={140} endY={220} size={120} hue="pink" />
            </Sequence>
          </>
        )}

        <Sequence from={TIMELINE.header.from} durationInFrames={TIMELINE.header.dur}>
          <HeaderScene
            brideShort={props.brideShort}
            groomShort={props.groomShort}
            date={props.date}
            venue={props.venue}
          />
        </Sequence>

        <Sequence from={TIMELINE.bismillah.from} durationInFrames={TIMELINE.bismillah.dur}>
          <BismillahScene parents={props.parents} inviteBody={props.inviteBody} />
        </Sequence>

        <Sequence from={TIMELINE.couple.from} durationInFrames={TIMELINE.couple.dur}>
          <CoupleScene
            brideName={props.brideName}
            brideFather={props.brideFather}
            groomName={props.groomName}
            groomFather={props.groomFather}
          />
        </Sequence>

        <Sequence from={TIMELINE.details.from} durationInFrames={TIMELINE.details.dur}>
          <DetailsScene
            dateLong={props.dateLong}
            venue={props.venue}
            venueAddress={props.venueAddress}
            scheduleMeal={props.scheduleMeal}
            scheduleArrival={props.scheduleArrival}
            rsvpUrl={props.rsvpUrl}
          />
        </Sequence>

        <Sequence from={TIMELINE.outro.from} durationInFrames={TIMELINE.outro.dur}>
          <OutroScene brandLine={props.brandLine} />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
