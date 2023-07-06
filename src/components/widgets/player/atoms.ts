import { atom } from 'jotai'

const musicAtom = atom({
  list: [563534789, 1447327083, 1450252250],
  isHide: true,
  isPlay: false,
  duration: 0,
  time: 0,
  playId: 0,
})
