import bus from '../../bus'
import axios from "axios"
import { find, propEq } from 'ramda'

// for parents
const onValidation = {
  mounted() {
    this.$on('veeValidate', () => {
      bus.$emit('validate');
    })

    bus.$on('errors-changed', (newErrors, oldErrors) => {
      this.veeErrors.clear();

      newErrors.forEach(error => {
        if (!this.veeErrors.has(error.field)) {
          this.veeErrors.errors = [...this.veeErrors.errors, {field: error.field, msg: error.msg, rule: error.rule, scope: error.scope}]
        }
      })
      if(newErrors == '') {
        var filter = this.veeErrors.errors.filter(function (error) {
          return error.field != 'Contact Email'
        });

        this.veeErrors.errors = filter
      }
    })

  }, beforeDestroy() {
    this.veeErrors.clear();
  }
}

// for children
const emitValidationErrors = {
  methods: {
    onValidate() {
      this.$validator.validateAll();
      if (this.veeErrors.any()) {
        bus.$emit('errors-changed', this.veeErrors.errors)//errors
      }
    },
  },
  mounted() {
    //Listen on the bus for the parent component running validation
    bus.$on('validate', this.onValidate)

    // Watch if veeErrors.updates
    this.$watch(() => this.veeErrors.errors, (newValue, oldValue) => {

      const newErrors = newValue.filter(error =>
        find(propEq('field', error.field))(oldValue)
      )
      const oldErrors = oldValue.filter(error =>
        find(propEq('field', error.field))(newValue)
      )

      bus.$emit('errors-changed', newErrors, oldErrors)
    })
  },
  beforeDestroy() {
   //When destroying the element remove the listeners on the bus.
   //Useful for dynaically adding and removing child components
   this.veeErrors.clear()
   bus.$emit('errors-changed', [], this.veeErrors.errors)
   bus.$off('validate', this.onValidate)
  },
}

export { emitValidationErrors, onValidation}
