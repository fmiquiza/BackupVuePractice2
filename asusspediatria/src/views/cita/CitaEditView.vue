<template>
  <div>
    <h1>Editar Cita</h1>
    <form @submit.prevent="submitForm" v-if="form">

      <div class="form-group">
        <label for="pediatra">Pediatra:</label>
        <select id="pediatra" v-model="form.pediatraId" :class="{ 'is-invalid': errors.pediatraId }">
          <option :value="pediatra.id" v-for="(pediatra, index) in pediatraList" :key="`pediatra-${index}`">{{ pediatra.nombre }}
          </option>
        </select>
        <div v-if="errors.pediatraId" class="invalid-feedback">{{ errors.pediatraId }}</div>
      </div>

      <div class="form-group">
        <label for="apoderado">Apoderado:</label>
        <select id="apoderado" v-model="form.apoderadoId" :class="{ 'is-invalid': errors.apoderadoId }" @change="setHijos()">
          <option :value="apoderado.id" v-for="(apoderado, index) in apoderadoList" :key="`apoderado-${index}`">{{ apoderado.nombre }}
          </option>
        </select>
        <div v-if="errors.apoderadoId" class="invalid-feedback">{{ errors.apoderadoId }}</div>
      </div>

      <div class="form-group">
        <label for="hijo">Hijo:</label>
        <select id="hijo" v-model="form.hijoId" :class="{ 'is-invalid': errors.hijoId }">
          <option :value="hijo.id" v-for="(hijo, index) in hijoList" :key="`apoderado-${index}`">{{ hijo.nombre }}
          </option>
        </select>
        <div v-if="errors.hijoId" class="invalid-feedback">{{ errors.hijoId }}</div>
      </div>

      <div class="form-group">
        <label for="motivo">Motivo:</label>
        <select id="motivo" v-model="form.motivo" :class="{ 'is-invalid': errors.motivo }">
          <option :value="motivo" v-for="(motivo, index) in motivoList" :key="`motivo-${index}`">{{ motivo }}</option>
        </select>
        <div v-if="errors.motivo" class="invalid-feedback">{{ errors.motivo }}</div>
      </div>

      <div class="form-group">
        <label for="fecha">Fecha:</label>
        <input type="date" id="fecha" v-model="form.fecha" :class="{ 'is-invalid': errors.fecha }"
          placeholder="Ingrese la fecha" />
        <div v-if="errors.fecha" class="invalid-feedback">{{ errors.fecha }}</div>
      </div>

      <div class="form-group">
        <label for="hora">Hora:</label>
        <input type="time" id="fecha" v-model="form.hora" :class="{ 'is-invalid': errors.hora }"
          placeholder="Ingrese la hora" />
        <div v-if="errors.hora" class="invalid-feedback">{{ errors.hora }}</div>
      </div>
      
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'CitaEdit',
  data() {
    return {
      pediatraList: [],
      apoderadoList: [],
      hijoList: [],
      motivoList: [
        "Vacunación",
        "Revisión cardiológica",
        "Chequeo general",
        "Chequeo dermatológico"
      ],
      errors: {}
    };
  },
  props:['item'],
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.pediatraId) {
        this.errors.pediatraId = 'El Pediatra es obligatorio.';
      }

      if (!this.form.apoderadoId) {
        this.errors.apoderadoId = 'El Apoderado es obligatoria.';
      }
      
      if (!this.form.hijoId) {
        this.errors.hijoId = 'La hijo es obligatorio.';
      }

      if (!this.form.motivo) {
        this.errors.motivo = 'El motivo es obligatorio.';
      }

      if (!this.form.fecha) {
        this.errors.fecha = 'La fecha es obligatorio.';
      }

      if (!this.form.hora) {
        this.errors.hora = 'La hora es obligatorio.';
      }


      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          apoderadoId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.patch(this.baseUrl + "/citas/"+this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getPediatraList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/pediatras")
        .then(function (response) {
          vm.pediatraList = response.data;
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
    setHijos(){
      const vm = this;
            this.axios.get(this.baseUrl + "/hijos?apoderadoId=" + this.form.apoderadoId)
                .then(function (response) {
                    vm.hijoList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
    }
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    },
    form(){
      return Object.assign({},this.item);
    }
  },
  mounted() {
    this.getApoderadoList();
    this.getPediatraList();
  },
}
</script>
  
<style scoped></style>
  