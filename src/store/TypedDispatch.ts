import { AnyAction } from "redux";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { RootState } from "./RootState";

export type TypedThunkResult<R> = ThunkAction<R, RootState, never, AnyAction>;
export type TypedDispatch = ThunkDispatch<RootState, never, AnyAction>;
