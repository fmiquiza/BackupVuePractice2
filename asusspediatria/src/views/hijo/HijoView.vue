<template>
    <div>
        <!-- Add a loader component -->
        <div v-if="loading" class="loader">
            <img src="loader.gif" alt="Loading...">
        </div>
        <Modal v-model:modelValue="showModalNuevo">
            <HijoNew @on-register="onRegister($event)"/>
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <HijoEdit @on-update="onUpdate($event)" :item="itemToEdit"/>
        </Modal>
        <h1>Lista de Hijos</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()">
        <table v-if="!loading">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Nombre</th>
                    <th>Género</th>
                    <th>Alergia(s)</th>
                    <th>Edad</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.nombre }}</td>
                    <td>{{ item.género }}</td>
                    <td>{{ item.alergia }}</td>
                    <td>{{ item.edad }}</td>
                    <td>
                        <button @click="irVacunas(item.id)" class="btn btn-info" style="margin-right: 15px;">Vacunas</button>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import HijoNew from './HijoNewView.vue'
import HijoEdit from './HijoEditView.vue'


export default {
    name: 'Hijo',
    data() {
        return {
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: [],
            loading: false
            
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
        HijoNew,
        HijoEdit
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            this.loading = true; // Set loading to true
            const vm = this;
             this.axios.get(this.baseUrl + "/hijos?_expand=apoderado&q=" + this.textToSearch)
             .then(function (response) {
                      vm.itemList = response.data;
                      console.log(response.data); // Add this line to inspect the API response data
                      // Add a check to ensure that itemList is populated with data
                 if (vm.itemList && vm.itemList.length > 0) {
                // Render the template
                 } else {
                     // Handle the case where itemList is empty
                    
            }
            vm.loading = false;
         })
             .catch(function (error) {
                  console.error(error);
          });
        },
        irVacunas(id){
            this.$router.push("/hijo/"+id+"/vacunas");
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/hijos/" + id)
                    .then(function (response) {
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }

        },
        buscar() {
            this.getList();
        },
        onRegister(event) {
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info');
        },
        showToast(message, type) {
            this.$toast.show(message, type);
        }
    },
    computed: {
        // propiedades computadas que dependen de otras propiedades reactivas
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        }
    },
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
    },
    emits: [] // los eventos personalizados que el componente puede emitir.
}
</script>
  
<style>
.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.loader img {
    width: 50px;
    height: 50px;
}
</style>