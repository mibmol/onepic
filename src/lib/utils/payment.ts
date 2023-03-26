import { always, cond, equals } from "ramda"

export const getCreditPrice = cond([
  [equals("50"), always({ value: 3.5 })],
  [equals("100"), always({ value: 6.5 })],
  [equals("200"), always({ value: 11 })],
  [equals("500"), always({ value: 24 })],
  [equals("1000"), always({ value: 48 })],
])

export const getSubscriptionPrice = cond([
  [equals("month"), always({ value: 9.5 })],
  [equals("year"), always({ value: 86, messageToken: "save 12%" })],
])
