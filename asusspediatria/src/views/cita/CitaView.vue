<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <CitaNewView @on-register="onRegister()" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <CitaEditView @on-update="onUpdate()" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Citas</h1>
        <div>{{path}}</div>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()">
        <div style="margin: 20px 0;">
            <h3>Filtros:</h3>
            <form @submit.prevent="filtrar()">

                <label for="fecha"> Fecha: </label>
                <input type="date" id="fecha" v-model="filter.fecha" placeholder="Ingrese la fecha" />

                <label for="pediatra"> Pediatra: </label>
                <select id="pediatra" v-model="filter.pediatraId" @change="updatePediatra">
                    <option value="">Todos</option>
                    <option :value="pediatra.id" v-for="(pediatra, index) in pediatraList" :key="`pediatra-${index}`">{{ pediatra.nombre }}
                    </option>
                  </select>
                  <span>{{ selectedPediatra ? selectedPediatra.nombre : '' }}</span>
                <button type="submit" class="btn btn-lith">Fitrar</button>
            </form>
        </div>
        <table v-if="apoderadoList && hijoList">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Pediatra</th>
                    <th>Apoderado</th>
                    <th>Hijo</th>
                    <th>Motivo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.hora }}</td>
                    <td>{{ getPediatra(item.pediatraId) ? getPediatra(item.pediatraId).nombre : '' }}</td>
                    <td>{{ getApoderado(item.apoderadoId) ? getApoderado(item.apoderadoId).nombre : '' }}</td>
          <td>{{ getHijo(item.hijoId) ? getHijo(item.hijoId).nombre : '' }}</td>
                    <td>{{ item.motivo }}</td>
                    <td>
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
import CitaNewView from './CitaNewView.vue'
import CitaEditView from './CitaEditView.vue'


export default {
    name: 'Cita',
    data() {
        return {
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            textToFilter: '',
            itemList: [],
            pediatraList: [],
            path: '',
            filter: {
                fecha: null,
                pediatraId:''
            },
            apoderadoList: [],
            hijoList: [],
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
        CitaNewView,
        CitaEditView
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.path = this.baseUrl + "/citas?_sort=fecha,hora&_order=desc,asc&_expand=apoderado&_expand=hijo&_expand=pediatra" + this.textToFilter + "&q=" + this.textToSearch;
            this.axios.get(this.baseUrl + "/citas?_sort=fecha,hora&_order=desc,asc&_expand=apoderado&_expand=hijo&_expand=pediatra" + this.textToFilter + "&q=" + this.textToSearch)
                .then(function (response) {
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
        getPediatra(pediatraId) {
             return this.pediatraList.find(p => p.id === pediatraId);
        },
        
        getApoderado(apoderadoId) {
            return this.apoderadoList.find(a => a.id === apoderadoId);
        },
        getHijo(hijoId) {
            return this.hijoList.find(h => h.id === hijoId);
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
  getHijoList() {
    const vm = this;
    this.axios.get(this.baseUrl + "/hijos")
      .then(function (response) {
        vm.hijoList = response.data;
      })
      .catch(function (error) {
        console.error(error);
      });
  },

        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/citas/" + id)
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
        filtrar() {
            this.textToFilter = '';
            if (this.filter.fecha != null && this.filter.fecha != '') {
                this.textToFilter += "&fecha=" + this.filter.fecha;
            }
            if (this.filter.pediatraId != null && this.filter.pediatraId != '') {
                this.textToFilter += "&pediatraId=" + this.filter.pediatraId;
            }
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
        },
        selectedPediatra(pediatraId) {
            return this.pediatraList.find(p => p.id === pediatraId);
     }
    },
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
        this.getPediatraList();
        this.getApoderadoList();
        this.getHijoList();
    },
    emits: [] // los eventos personalizados que el componente puede emitir.
}
</script>
  
<style></style>