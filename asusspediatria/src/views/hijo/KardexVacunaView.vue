<template>
  <div v-if="hijoDatos">
    <h1>Kardex de Vacunas {{hijoId}}</h1>
    <div>
      <h2>Información del Apoderado</h2>
      <p>Nombre: {{ hijoDatos?.apoderado?.nombre }}</p>
      <p>Dirección: {{ hijoDatos?.apoderado?.direccion }}</p>
      <p>Teléfono: {{ hijoDatos?.apoderado?.telefono }}</p>
    </div>
    <div>
      <h2>Información - Hijo(a)</h2>
      <p>Nombre: {{ hijoDatos?.nombre }}</p>
      <p>Género: {{ hijoDatos?.género }} </p>
      <p>Alergia(s): {{ hijoDatos?.alergia }}</p>
      <p>Edad:{{ hijoDatos?.edad }}</p>
    </div>
    <div>
      <h2>Vacunas Aplicadas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre de la Vacuna</th>
            <th>Fecha de Aplicación</th>
          </tr>
        </thead>
        <tbody>
      <tr v-for="vacuna in listaVacunas" :key="vacuna.id">
        <td>{{ vacuna.vacuna?.nombre }}</td>
       <td>{{ vacuna.fecha }}</td>
      </tr>
    </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  export default {
    name: 'KardexVacunaView',
    data() {
      return {
        parent: {
          name: 'Jessica Holmes',
          address: '525 Arlington Road',
          phone: '+1 449299039494'
        },
        child: {
          name: 'Danny Holmes',
          gender: 'Masculino',
          allergy: 'milk',
          age: '3'
        },
        hijoDatos:null,
        listaVacunas:[],
        vaccines: [
          { id: 1, name: 'Rotavirus', date: '2022-01-15', pediatrician: 'Dr. Drake' },
          { id: 2, name: 'RDP', date: '2022-02-20', pediatrician: 'Dr. House' },
          { id: 3, name: 'Influenza', date: '2022-03-10', pediatrician: 'Dr. D. Houser' }
        ]
      };
    },
    methods: {
      getHijo(){
        const hijoId = this.$route.params.id;
        const vm = this;
        this.axios.get(this.getBaseUrl+"/hijos/"+hijoId+"?_expand=apoderado")
        .then(function(response){
          vm.hijoDatos = response.data;
        })
        .catch(function(error){
          console.error(error);
        })
      },
      getVacuna(){
        const hijoId = this.$route.params.id;
        const vm = this;
        this.axios.get(this.getBaseUrl+"/hijosVacunas?_expand=vacuna&hijoId="+hijoId)
        .then(function(response){
          vm.listaVacunas = response.data;
        })
        .catch(function(error){
          console.error(error);
        })
      }
    },
    computed: {
      ...mapGetters(['getBaseUrl']),
        hijoId() {
        // Recupera el parámetro de ruta 'id'
        return this.$route.params.id;
      }
    },
    mounted(){
      this.getHijo();
      this.getVacuna();
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>
  