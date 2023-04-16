import { memoizeWith } from "ramda"

const dateFormater = memoizeWith(
  () => "localDateFormaterKey",
  () => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },
)

export function formatDate(date: Date | string) {
  return dateFormater().format(new Date(date))
}
