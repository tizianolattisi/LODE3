import { UserState } from './states/user.state';

export interface AppState {

  readonly user: UserState;
}
