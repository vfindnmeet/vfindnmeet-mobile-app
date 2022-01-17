import { TYPE_CLEAR_PROFILE, TYPE_DELETE_IMAGE, TYPE_FETCH_PROFILE, TYPE_SET_DESCRIPTION, TYPE_SET_PROFILE, TYPE_SET_PROFILE_INFO } from "../actions/profile";
import { TYPE_SET_PROFILE_IMAGE } from "../actions/user";

const INITIAL_STATE: any = {};

export default function profileReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_PROFILE:
      console.log('profileReducer', TYPE_FETCH_PROFILE);
      return {
        ...state,
        loading: true,
        profile: null
      };
    case TYPE_CLEAR_PROFILE:
      return {};
    case TYPE_SET_PROFILE:
      // console.log('profileReducer', TYPE_SET_PROFILE);

      // const p = action.payload.profile;

      // if (p.images) {
      //   const targetIndex = p.images.findIndex(({ imageId }: any) => imageId === action.payload.profile.profile_image_id);
      //   const tmp = p.images[targetIndex];
      //   p.images[targetIndex] = p.images[0];
      //   p.images[0] = tmp;
      // }

      // console.log('xx', JSON.stringify(action.payload.profile.images, null, 2))

      return {
        ...state,
        loading: false,
        profile: action.payload.profile
      };
    case TYPE_DELETE_IMAGE:
      console.log('profileReducer', TYPE_DELETE_IMAGE);
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          images: state.profile.images.filter(({ imageId }: any) => imageId !== action.payload.imageId)
        } : {}
      };
    case TYPE_SET_DESCRIPTION:
      console.log('profileReducer', TYPE_SET_DESCRIPTION);
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          description: action.payload.description
        } : {}
      };
    case TYPE_SET_PROFILE_INFO:
      // console.log('profileReducer', TYPE_SET_DESCRIPTION);
      const newState = {
        ...state,
        profile: state.profile ?? {}
      };

      Object.keys(action.payload)
        .filter(key => action.payload[key] !== undefined)
        .forEach(key => {
          newState.profile.info[key] = action.payload[key];
        });

      return newState;
    case TYPE_SET_PROFILE_IMAGE:
      // console.log('TYPE_SET_PROFILE_IMAGE!!');
      const profile = state.profile ?? {};
      profile.profile_image_id = action.payload.imageId;
      // console.log('action.payload.imageId:', action.payload.imageId);

      if (profile.images) {
        const targetIndex = profile.images.findIndex(({ imageId }: any) => imageId === action.payload.imageId);
        // console.log('targetIx', targetIndex);
        if (targetIndex < 0) {
          return state;
        }

        const tmp = profile.images[targetIndex];
        profile.images[targetIndex] = profile.images[0];
        profile.images[0] = tmp;
      }

      return {
        ...state,
        profile: {
          ...profile
        }
      };
    // return {
    //   ...state,
    //   profile: state.profile ? {
    //     ...state.profile,
    //     description: action.payload.description
    //   } : {}
    // };
  }

  return state;
}
