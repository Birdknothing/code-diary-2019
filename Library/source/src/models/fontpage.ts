import { GetMyCloudInfo } from "@/services";
export default {
    namespace: "fontpage",
    state: {
        pic_total: 1,
        pic_used: 0,
        audio_total: 1,
        audio_used: 0
    },
    reducers: {
        render(state, { payload }) {
            return { ...state, ...payload };
        }
    },
    effects: {
        *getCloudInfo({ payload }, { put }) {
            const [
                { total: pic_total = 1, used: pic_used = 0 },
                { total: audio_total = 1, used: audio_used = 0 }
            ] = yield [GetMyCloudInfo(payload[0]), GetMyCloudInfo(payload[1])];
            yield put({ type: "render", payload: { pic_total, pic_used, audio_total, audio_used } });
        }
    }
} as any;
