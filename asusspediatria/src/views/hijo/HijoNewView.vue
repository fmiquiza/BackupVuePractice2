<template>
  <div>
    <h1>Registrar Hijo</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="apoderado">Apoderado:</label>
        <select id="apoderado" v-model="form.apoderadoId" :class="{ 'is-invalid': errors.apoderadoId }">
          <option :value="apoderado.id" v-for="(apoderado, index) in apoderadoList" :key="`apoderado-${index}`">{{ apoderado.nombre }}
          </option>
        </select>
        <div v-if="errors.apoderadoId" class="invalid-feedback">{{ errors.apoderadoId }}</div>
      </div>

      <div class="form-group">
        <label for="name">Nombre hijo:</label>
        <input type="text" id="name" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
      </div>

      <div class="form-group">
        <label for="género">Género:</label>
        <select id="género" v-model="form.género" :class="{ 'is-invalid': errors.género }">
          <option :value="género" v-for="(género, index) in géneroList" :key="`género-${index}`">{{ género }}</option>
        </select>
        <div v-if="errors.género" class="invalid-feedback">{{ errors.género }}</div>
      </div>

      <div class="form-group">
        <label for="alergia">Alergia(s):</label>
        <input type="text" id="alergia" v-model="form.alergia" :class="{ 'is-invalid': errors.alergia }"
          placeholder="Ingrese la alergia" />
        <div v-if="errors.alergia" class="invalid-feedback">{{ errors.alergia }}</div>
      </div>

      <div class="form-group">
        <label for="edad">Edad (años):</label>
        <input type="number" id="edad" v-model="form.edad" :class="{ 'is-invalid': errors.edad }"
          placeholder="Ingrese la edad" />
        <div v-if="errors.edad" class="invalid-feedback">{{ errors.edad }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'HijoNew',
  data() {
    return {
      apoderadoList: [],
      géneroList: [
        "Masculino",
        "Femenino"
      ],
      form: {
        nombre: '',
        género: '',
        alergia: '',
        edad: '',
        apoderadoId: null
      },
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
      }

      if (!this.form.género) {
        this.errors.género = 'La género es obligatoria.';
      }

      if (!this.form.alergia) {
        this.errors.alergia = 'La alergia es obligatoria.';
      }

      if (!this.form.edad) {
        this.errors.edad = 'La edad es obligatoria.';
      }

      if (!this.form.apoderadoId) {
        this.errors.apoderadoId = 'El Apoderado es obligatoria.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          nombre: '',
          género: '',
          alergia: '',
          edad: '',
          apoderadoId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/hijos", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getApoderadoList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/apoderados")
        .then(function (response) {
          vm.apoderadoList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
  mounted() {
    this.getApoderadoList();
  },
}
</script>
  
<style scoped></style>
  