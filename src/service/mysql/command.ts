export interface CommandInterface {
  table: string | null
  commands: Array<string>
  insert(data: DBData): CommandInterface
  where(props: DBData): CommandInterface
  done(source?: boolean): string
}
export type DBData = Record<string, string | number>

type ConditionOperator =
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | '!='
  | 'LIKE'
  | 'NOT LIKE'
  | 'IN'
  | 'NOT IN'
  | 'BETWEEN'
  | 'NOT BETWEEN'

type Condition = [ConditionOperator, string | number]
type SelectObj = Record<string, string | 1>
type SelectProps = Record<string, SelectObj | string | 1>
type WhereObj = Record<string, string | number | Condition>
type WhereProps = Record<string, WhereObj | string | number | Condition>
type Source = {
  str: string | number
  toString(): string
}

export const condition = (operator: ConditionOperator, value: string | number) =>
  [operator, value] as Condition

const source = (str: string | number): Source => {
  return {
    str,
    toString() {
      return typeof str === 'string' ? str : `${str}`
    }
  }
}
class Command implements CommandInterface {
  table: string | null
  commands: Array<string> = []
  values: Array<string | number | any> = []
  constructor(table?: string) {
    this.table = table || null
  }
  select(props?: SelectProps) {
    if (!props) {
      props = { '*': 1 }
    }

    const multiSelect = Object.keys(props).some((k) => {
      return typeof props![k] === 'object'
    })

    const getSelectCommand = (obj: SelectProps, table?: string) => {
      return Object.keys(obj).map((k) => {
        let val = obj![k] === 1 ? (k === '*' ? '*' : `\`${k}\``) : `\`${k}\` as \`${obj![k]}\``
        return table ? `\`${table}\`.${val}` : val
      })
    }

    if (!multiSelect) {
      this.commands.push(`SELECT ${getSelectCommand(props).join(',')} FROM \`${this.table}\``)
    } else {
      const tableKey = Object.keys(props)
      const selectCommand = tableKey.map((table) => {
        const selectObj = props![table]
        return getSelectCommand(selectObj as SelectObj, table)
      })
      this.commands.push(
        `SELECT ${selectCommand.join(',')} FROM ${tableKey.map((t) => `\`${t}\``).join(',')}`
      )
    }

    return this
  }
  insert(data: DBData) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const command = `INSERT INTO \`${this.table}\` (${keys
      .map((k) => `\`${k}\``)
      .join(',')}) VALUES (${values.map(() => '?').join(',')})`
    this.values.push(...values)
    this.commands.push(command)
    return this
  }
  update(data: DBData) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const command = `UPDATE \`${this.table}\` SET ${keys.map((k) => `\`${k}\` = ?`).join(',')}`
    this.values.push(...values)
    this.commands.push(command)
    return this
  }
  where(props: WhereProps) {
    const getWhereCommand = (obj: WhereProps, table?: string): string[] => {
      return Object.keys(obj).map((k) => {
        const v: Condition | string | number | WhereObj = obj[k]
        const decode = table ? source : (v: string | number) => v

        if (Array.isArray(v)) {
          this.values.push(decode(v[1]))
          return table ? `\`${table}\`.\`${k}\` ${v[0]} ?` : `\`${k}\` ${v[0]} ?`
        }
        if (typeof v === 'object') {
          const command = getWhereCommand(v as WhereObj, k)
          return `${command.join(' AND ')}`
        }
        this.values.push(decode(v))
        return table ? `\`${table}\`.\`${k}\` = ?` : `\`${k}\` = ?`
      })
    }

    this.commands.push(`WHERE ${getWhereCommand(props).join(' AND ')}`)
    return this
  }
  orderBy(props: Record<string, 1 | -1>) {
    const keys = Object.keys(props)
    const command = keys
      .map((k) => {
        return `\`${k}\` ${props[k] === 1 ? 'ASC' : 'DESC'}`
      })
      .join(',')
    this.commands.push(`ORDER BY ${command}`)
    return this
  }
  limit(limit: number) {
    this.commands.push(`LIMIT ${limit}`)
    return this
  }
  offset(offset: number) {
    this.commands.push(`OFFSET ${offset}`)
    return this
  }

  add(command: string) {
    this.commands.push(command)
    return this
  }
  done() {
    // if (source) {
    //   return {
    //     sql: this.commands.join(' '),
    //     values: this.values
    //   }
    // }
    let index = -1
    const { values } = this
    return this.commands.join(' ').replaceAll('?', () => {
      index++
      if (typeof values[index] === 'string') {
        return `'${values[index]}'`
      }
      if (typeof values[index] === 'object') {
        return `${values[index].toString()}`
      }
      return `${values[index]}`
    })
  }
}

export { Command }
export default Command
