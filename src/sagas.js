import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects'

export function* incrementAsync() {
    yield delay(1000)
    yield put({ type: 'INCREMENT', val: 2})
}

// export function* DecrementAsync() {
//     yield delay(1000)
//     yield put({ type: 'INCREMENT', val: 1})
// }

export default function* rootSaga() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync)
    // yield takeEvery('INCREMENT_IF_ODD', DecrementAsync)
}
