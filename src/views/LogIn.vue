<template>
    <div class="container">
        <div class="form-container">
            <Alert v-if="show_alert" type="error" closable show-icon>
                <Icon type="ios-lock-outline" slot="icon"></Icon>
                Your Login Session has expired. Please log in again to continue.
            </Alert>
                <div class="login-banner">
                    <img src="../assets/login_logo.png" alt="login" class="img-responsive">
                    <img src="../assets/login_logo_2.png" alt="login" class="img-responsive" style="float: right;">
                </div>
            <Card dis-hover>
                <!--
                <div class="login-title" slot="title">
                    <img src="../assets/login_logo.png" alt="login">
                </div>
                -->
                <Form ref="form" :model="form" :rules="formRule">
                    <FormItem prop="username">
                        <Input type="text" v-model="form.username" placeholder="Username" size="large">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="form.password" placeholder="Password" size="large">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" 
                                @click="handleSubmit('form')" 
                                :loading="loading"
                                style="float:right;">
                                <span v-if="!loading">Sign In</span>
                                <span v-else>Signing In...</span>
                        </Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
    </div>
</template>
<script>
import $axios from "../utils/http";

    export default {

        props: {
          show_alert: {
            type: Boolean,
            default: false
          }
        },

        data () {
            return {
                loading: false,
                form: {
                    username: '',
                    password: ''
                },
                formRule: {
                    username: [
                        { required: true, message: 'Please fill in your username', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in your password.', trigger: 'blur' },
                    ]
                }
            }
        },

        computed: {
            isLoggingIn() {
                this.$store.getters['user/isLoggingIn'];
            }

        },

        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    this.loading = true;
                    if (valid) {
                        this.$store.dispatch('user/logIn', {
                                            router: this.$router,
                                            data: this.form
                                            }).then((response) => {
                                                this.$Message.success('Sign In successful');
                                                this.$router.push('/');
                                            }).catch((error) => {

                                                if (error.response) {
                                                    this.$Message.error(error.response.data);
                                                } else {
                                                    this.$Message.error('Unable to connect to server!');
                                                }
                                                this.loading = false;
                                            });
                    } else {
                        this.$Message.error('The information you provided is incomplete!');
                    }
                })
            }
        },
    }
</script>

<style scoped>
     .container {
         height: auto;
     }

     .form-container{
         width: 35%;
         min-width: 240px;
         height: auto;
         margin: 8% auto;
     }
     
     .login-banner {
         background: rgb(35, 107, 58);
         margin-bottom: -10px;
         height: auto;
         border-top-left-radius: 4px;
         border-top-right-radius: 4px;
     }

     .img-responsive {
         margin-top: 10px;
         max-width: 100%;
         height: auto;
     }
     
</style>
