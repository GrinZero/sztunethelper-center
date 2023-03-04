import moment from 'moment'

/**
 * 格式化时间
 * @param date
 * @param pattern
 * @returns
 */
export function format(date: Date, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(pattern)
}
