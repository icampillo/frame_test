import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { currentURL } from "./utils";
import { createDebugUrl } from "./debug";

type State = {
  pageIndex: number;
};

const totalPages = 5;
const initialState: State = { pageIndex: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
      ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % totalPages
      : state.pageIndex,
  };
};

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/examples/multi-page");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);
  const imageUrl = `https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.spreadshirt.com.au%2Fshop%2Fdesign%2Flow%2Bbattery%2Bsticker-D5f58e344f937642510a79d7d%3Fsellable%3DgnBdj9EONRtb7NRAOrOe-1459-215&psig=AOvVaw18I2c-PFdfmMemqCL4kPrm&ust=1710958652066000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMiHu-f3gIUDFQAAAAAdAAAAABAE`;

  // then, when done, return next frame
  return (
    <div>
      Multi-page example <Link href={createDebugUrl(url)}>Debug</Link>
      <FrameContainer
        pathname="/examples/multi-page"
        postUrl="/examples/multi-page/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="flex flex-col">
            <img width={573} height={300} src={imageUrl} alt="Image" />
            <div tw="flex">
              This is slide {state.pageIndex + 1} / {totalPages}
            </div>
          </div>
        </FrameImage>
      </FrameContainer>
    </div>
  );
}
