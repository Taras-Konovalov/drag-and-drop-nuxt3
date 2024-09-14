interface FieldRulesComposition {
  required: (v: string | number) => boolean | string
}

export function useFieldRules(): FieldRulesComposition {
  const required = (v: string | number | string[]) => {
    if (Array.isArray(v)) {
      return v.length > 0 || 'This field is required'
    }
    return (!!v || v === 0) || 'This field is required'
  }

  return {
    required,
  }
}
