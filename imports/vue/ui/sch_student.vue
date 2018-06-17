<template>
    <div class="sch_student">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddSchStudent = true,resetForm()">
                            <i class="fa fa-plus"></i> {{langConfig['title']}}
                        </a>
                    </h4>
                </el-col>
                <el-col :span="16" style="text-align: right; margin-right: 10px">
                    <br>
                    <el-row type="flex" justify="center">
                        <el-col :span="8"></el-col>
                        <el-col :span="8"></el-col>
                        <el-col :span="8">
                            <el-input
                                    :placeholder="langConfig['searchHere']"
                                    suffix-icon="el-icon-search"
                                    v-model="searchData"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr>
            <br>
            <slot v-if="loading">
                <div class="row">
                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                        <!--<loader></loader>-->
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        :data="schStudentData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="personal.name"
                            :label="langConfig['name']">
                    </el-table-column>
                    <el-table-column
                            prop="personal.latinName"
                            :label="langConfig['latinName']">
                    </el-table-column>
                    <el-table-column
                            prop="personal.gender"
                            :label="langConfig['gender']">
                    </el-table-column>
                    <el-table-column
                            prop="personal.phoneNumber"
                            :label="langConfig['phoneNumber']">
                    </el-table-column>
                    <el-table-column
                            prop="personal.dobName"
                            :label="langConfig['dob']">
                    </el-table-column>
                    <el-table-column
                            prop="personal.province"
                            :label="langConfig['province']">
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="180"

                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeSchStudent(scope.$index,scope.row,schStudentData)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="findSchStudentById(scope),dialogUpdateSchStudent= true"
                                           :disabled="disabledUpdate"></el-button>
                                <el-button type="success" size="small" class="cursor-pointer"
                                           @click="dialoginputTranscript= true,popUpInputTranscript(scope.row)"
                                           :disabled="disabledUpdate">T
                                </el-button>
                                <el-button type="warning" icon="el-icon-printer" size="small" class="cursor-pointer"
                                           @click="dialogUpdateSchStudent= true,printTranscript(scope.row)"
                                           :disabled="disabledUpdate">
                                </el-button>

                            </el-button-group>

                        </template>
                    </el-table-column>

                </el-table>
                <!--Pagination-->
                <br>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24" style="text-align: center;">
                        <div class="block">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="currentPage" :page-sizes="[10,20, 50, 100,200]"
                                           :page-size="currentSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="count">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <br>
            </slot>
            <!--End Pagination-->
        </div>

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['add']"
                :visible.sync="dialogAddSchStudent"
                :fullscreen="fullscreen"
        >
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schStudentForm" :rules="rules" ref="schStudentFormAdd" label-width="120px"
                     class="schStudentForm">
                <el-row>
                    <el-col :span="10">
                        <p><b><i class="material-icons">
                            perm_identity
                        </i> {{langConfig['personalInfo']}}</b>
                            <el-date-picker
                                    v-model="schStudentForm.yearFrom"
                                    type="year"
                                    placeholder="Pick start year">
                            </el-date-picker>
                            To
                            <el-date-picker
                                    v-model="schStudentForm.yearTo"
                                    type="year"
                                    placeholder="Pick end year">
                            </el-date-picker>
                        </p>
                        <hr>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="langConfig['name']" prop="name">
                                    <el-input v-model="schStudentForm.name"></el-input>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="14">
                                        <el-form-item :label="langConfig['latinName']" prop="latinName">
                                            <el-input v-model="schStudentForm.latinName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item :label="langConfig['dob']" prop="dob">
                                            <el-date-picker
                                                    v-model="schStudentForm.dob"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['gender']" prop="gender">
                                            <el-radio-group v-model="schStudentForm.gender">
                                                <el-radio v-for="mt in genderList" :label="mt.value"
                                                          :key="mt.value"
                                                >
                                                    {{mt.label}}
                                                </el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['status']" prop="status">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.status"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in statusList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['nationality']" prop="nationality">
                                            <el-input v-model="schStudentForm.nationality"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['nation']" prop="nation">
                                            <el-input v-model="schStudentForm.nation"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>


                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 36px;">{{langConfig['pob']}}</span>
                                    </div>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['village']" prop="village">
                                                <el-input v-model="schStudentForm.village"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['commune']" prop="commune">
                                                <el-input v-model="schStudentForm.commune"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['district']" prop="district">
                                                <el-input v-model="schStudentForm.district"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['province']" prop="province">
                                                <el-input v-model="schStudentForm.province"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-card>
                                <br>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['level']" prop="level">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.level"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in levelList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['major']" prop="majorId">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.majorId"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in majorList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['fromSchool']" prop="fromSchool">
                                            <el-input v-model="schStudentForm.fromSchool"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['provinceSchool']" prop="provinceSchool">
                                            <el-input v-model="schStudentForm.provinceSchool"></el-input>
                                        </el-form-item>
                                    </el-col>


                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['occupation']" prop="occupation">
                                            <el-input v-model="schStudentForm.occupation"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['occupationPlace']" prop="occupationPlace">
                                            <el-input v-model="schStudentForm.occupationPlace"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 36px;">{{langConfig['address']}}</span>
                                    </div>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['homeNo']" prop="homeNoCurrent">
                                                <el-input v-model="schStudentForm.homeNoCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['group']" prop="groupCurrent">
                                                <el-input v-model="schStudentForm.groupCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['village']" prop="villageCurrent">
                                                <el-input v-model="schStudentForm.villageCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['commune']" prop="communeCurrent">
                                                <el-input v-model="schStudentForm.communeCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['district']" prop="districtCurrent">
                                                <el-input v-model="schStudentForm.districtCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['province']" prop="provinceCurrent">
                                                <el-input v-model="schStudentForm.provinceCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-card>
                                <br>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['degree']" prop="degree">
                                            <el-input v-model="schStudentForm.degree"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['degreeYear']" prop="degreeYear">
                                            <el-input v-model="schStudentForm.degreeYear"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item :label="langConfig['phoneNumber']" prop="phoneNumber">
                                    <el-input v-model="schStudentForm.phoneNumber"></el-input>
                                </el-form-item>


                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="1">
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="13">
                        <p><b><i class="material-icons">
                            group
                        </i> {{langConfig['family']}}</b></p>
                        <hr>
                        <el-row>
                            <p>{{langConfig['parent']}}</p>
                            <el-col :span="12">
                                <el-form-item :label="langConfig['faName']" prop="faName">
                                    <el-input v-model="schStudentForm.faName"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['bornYear']" prop="faYob">
                                    <el-input v-model="schStudentForm.faYob" type="number"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nationality']" prop="faNationality">
                                    <el-input v-model="schStudentForm.faNationality"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nation']" prop="faNation">
                                    <el-input v-model="schStudentForm.faNation"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['isDie']" prop="faIsDie">
                                    <el-switch
                                            v-model="schStudentForm.faIsDie"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                    >
                                    </el-switch>

                                </el-form-item>
                                <el-form-item :label="langConfig['occupation']" prop="faOccupation">
                                    <el-input v-model="schStudentForm.faOccupation"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="langConfig['moName']" prop="moName">
                                    <el-input v-model="schStudentForm.moName"></el-input>
                                </el-form-item>

                                <el-form-item :label="langConfig['bornYear']" prop="moYob">
                                    <el-input v-model="schStudentForm.moYob" type="number"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nationality']" prop="moNationality">
                                    <el-input v-model="schStudentForm.moNationality"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nation']" prop="moNation">
                                    <el-input v-model="schStudentForm.moNation"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['isDie']" prop="moIsDie">
                                    <el-switch
                                            v-model="schStudentForm.moIsDie"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                    >
                                    </el-switch>
                                </el-form-item>
                                <el-form-item :label="langConfig['occupation']" prop="moOccupation">
                                    <el-input v-model="schStudentForm.moOccupation"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item :label="langConfig['address']" prop="address">
                                    <el-input v-model="schStudentForm.address"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <p>{{langConfig['cousin']}}</p>
                            <el-table
                                    :data="cousinData"
                                    stripe
                                    style="width: 100%">
                                <el-table-column
                                        type="index"
                                        :index="indexMethod">
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['name']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.name"
                                                  :placeholder="langConfig['name']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['gender']">
                                    <template slot-scope="scope">
                                        <el-radio-group v-model="scope.row.gender" :placeholder="langConfig['gender']"
                                                        @change="handleEditCousin(scope.$index, scope.row)">
                                            <el-radio v-for="mt in genderList" :label="mt.value"
                                                      :key="mt.value"
                                            >
                                                {{mt.label}}
                                            </el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['age']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.age" :placeholder="langConfig['age']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['occupation']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.occupation"
                                                  :placeholder="langConfig['occupation']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['action']"
                                        width="120"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                                   size="small"
                                                   @click="handleAddCousin()"

                                        ></el-button>
                                        <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                                   size="small"
                                                   @click="removeCousinData(scope.$index,scope.row)"
                                        ></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>

                        <p><b><i class="material-icons">
                            school
                        </i> {{langConfig['study']}}</b></p>
                        <hr>
                        <el-row>
                            <el-table
                                    :data="studyData"
                                    stripe
                                    style="width: 100%">
                                <el-table-column
                                        type="index"
                                        :index="indexMethod">
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['studyAt']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.studyAt"
                                                  :placeholder="langConfig['studyAt']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['duration']"
                                >
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.duration"
                                                  :placeholder="langConfig['duration']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['grade']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.grade"
                                                  :placeholder="langConfig['grade']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['where']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.where"
                                                  :placeholder="langConfig['where']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="graduatedYear"
                                        :label="langConfig['graduatedYear']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.graduatedYear"
                                                  :placeholder="langConfig['graduatedYear']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['action']"
                                        width="120"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                                   size="small"
                                                   @click="handleAddStudy()"

                                        ></el-button>
                                        <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                                   size="small"
                                                   @click="removeStudy(scope.$index,scope.row)"
                                        ></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <br>
                        <br>
                        <el-form-item :label="langConfig['personalContract']" prop="personalContract">
                            <el-input type="textarea" v-model="schStudentForm.personalContract"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
            <span slot="footer" class="dialog-footer fix-dialog-footer">
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger" @click="dialogAddSchStudent= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['cancel']}}</el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right">
                         <el-button type="primary" @click.native="saveSchStudent()"><i
                                 class="el-icon-circle-check"> </i>&nbsp; {{langConfig['save']}}</el-button>
                    </el-col>
                </el-row>
            </span>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['update']"
                :visible.sync="dialogUpdateSchStudent"
                :fullscreen="fullscreen"
        >
            <hr style="margin-top: 0px !important;border-top: 2px solid teal">
            <el-form :model="schStudentForm" :rules="rules" ref="schStudentFormUpdate" label-width="120px"
                     class="schStudentForm">
                <el-row>
                    <el-col :span="10">
                        <p><b><i class="material-icons">
                            perm_identity
                        </i> {{langConfig['personalInfo']}}</b>
                            <el-date-picker
                                    v-model="schStudentForm.yearFrom"
                                    type="year"
                                    placeholder="Pick start year">
                            </el-date-picker>
                            To
                            <el-date-picker
                                    v-model="schStudentForm.yearTo"
                                    type="year"
                                    placeholder="Pick end year">
                            </el-date-picker>
                        </p>
                        <hr>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item :label="langConfig['name']" prop="name">
                                    <el-input v-model="schStudentForm.name"></el-input>
                                </el-form-item>
                                <el-row>
                                    <el-col :span="14">
                                        <el-form-item :label="langConfig['latinName']" prop="latinName">
                                            <el-input v-model="schStudentForm.latinName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-form-item :label="langConfig['dob']" prop="dob">
                                            <el-date-picker
                                                    v-model="schStudentForm.dob"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['gender']" prop="gender">
                                            <el-radio-group v-model="schStudentForm.gender">
                                                <el-radio v-for="mt in genderList" :label="mt.value"
                                                          :key="mt.value"
                                                >
                                                    {{mt.label}}
                                                </el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['status']" prop="status">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.status"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in statusList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['nationality']" prop="nationality">
                                            <el-input v-model="schStudentForm.nationality"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['nation']" prop="nation">
                                            <el-input v-model="schStudentForm.nation"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>


                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 36px;">{{langConfig['pob']}}</span>
                                    </div>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['village']" prop="village">
                                                <el-input v-model="schStudentForm.village"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['commune']" prop="commune">
                                                <el-input v-model="schStudentForm.commune"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['district']" prop="district">
                                                <el-input v-model="schStudentForm.district"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['province']" prop="province">
                                                <el-input v-model="schStudentForm.province"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-card>
                                <br>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['level']" prop="level">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.level"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in levelList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['major']" prop="majorId">
                                            <el-select style="display: block !important;"
                                                       filterable
                                                       v-model="schStudentForm.majorId"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in majorList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['fromSchool']" prop="fromSchool">
                                            <el-input v-model="schStudentForm.fromSchool"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['provinceSchool']" prop="provinceSchool">
                                            <el-input v-model="schStudentForm.provinceSchool"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['occupation']" prop="occupation">
                                            <el-input v-model="schStudentForm.occupation"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['occupationPlace']" prop="occupationPlace">
                                            <el-input v-model="schStudentForm.occupationPlace"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-card class="box-card">
                                    <div slot="header" class="clearfix">
                                        <span style="line-height: 36px;">{{langConfig['address']}}</span>
                                    </div>
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['homeNo']" prop="homeNoCurrent">
                                                <el-input v-model="schStudentForm.homeNoCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['group']" prop="groupCurrent">
                                                <el-input v-model="schStudentForm.groupCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['village']" prop="villageCurrent">
                                                <el-input v-model="schStudentForm.villageCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['commune']" prop="communeCurrent">
                                                <el-input v-model="schStudentForm.communeCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['district']" prop="districtCurrent">
                                                <el-input v-model="schStudentForm.districtCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="langConfig['province']" prop="provinceCurrent">
                                                <el-input v-model="schStudentForm.provinceCurrent"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-card>
                                <br>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['degree']" prop="degree">
                                            <el-input v-model="schStudentForm.degree"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['degreeYear']" prop="degreeYear">
                                            <el-input v-model="schStudentForm.degreeYear"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item :label="langConfig['phoneNumber']" prop="phoneNumber">
                                    <el-input v-model="schStudentForm.phoneNumber"></el-input>
                                </el-form-item>


                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="1">
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="13">
                        <p><b><i class="material-icons">
                            group
                        </i> {{langConfig['family']}}</b></p>
                        <hr>
                        <el-row>
                            <p>{{langConfig['parent']}}</p>
                            <el-col :span="12">
                                <el-form-item :label="langConfig['faName']" prop="faName">
                                    <el-input v-model="schStudentForm.faName"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['bornYear']" prop="faYob">
                                    <el-input v-model="schStudentForm.faYob" type="number"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nationality']" prop="faNationality">
                                    <el-input v-model="schStudentForm.faNationality"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nation']" prop="faNation">
                                    <el-input v-model="schStudentForm.faNation"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['isDie']" prop="faIsDie">
                                    <el-switch
                                            v-model="schStudentForm.faIsDie"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                    >
                                    </el-switch>

                                </el-form-item>
                                <el-form-item :label="langConfig['occupation']" prop="faOccupation">
                                    <el-input v-model="schStudentForm.faOccupation"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item :label="langConfig['moName']" prop="moName">
                                    <el-input v-model="schStudentForm.moName"></el-input>
                                </el-form-item>

                                <el-form-item :label="langConfig['bornYear']" prop="moYob">
                                    <el-input v-model="schStudentForm.moYob" type="number"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nationality']" prop="moNationality">
                                    <el-input v-model="schStudentForm.moNationality"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['nation']" prop="moNation">
                                    <el-input v-model="schStudentForm.moNation"></el-input>
                                </el-form-item>
                                <el-form-item :label="langConfig['isDie']" prop="moIsDie">
                                    <el-switch
                                            v-model="schStudentForm.moIsDie"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949"
                                    >
                                    </el-switch>
                                </el-form-item>
                                <el-form-item :label="langConfig['occupation']" prop="moOccupation">
                                    <el-input v-model="schStudentForm.moOccupation"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item :label="langConfig['address']" prop="address">
                                    <el-input v-model="schStudentForm.address"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <p>{{langConfig['cousin']}}</p>
                            <el-table
                                    :data="cousinData"
                                    stripe
                                    style="width: 100%">
                                <el-table-column
                                        type="index"
                                        :index="indexMethod">
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['name']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.name"
                                                  :placeholder="langConfig['name']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['gender']">
                                    <template slot-scope="scope">
                                        <el-radio-group v-model="scope.row.gender" :placeholder="langConfig['gender']"
                                                        @change="handleEditCousin(scope.$index, scope.row)">
                                            <el-radio v-for="mt in genderList" :label="mt.value"
                                                      :key="mt.value"
                                            >
                                                {{mt.label}}
                                            </el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['age']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.age" :placeholder="langConfig['age']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['occupation']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.occupation"
                                                  :placeholder="langConfig['occupation']"
                                                  @change="handleEditCousin(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['action']"
                                        width="120"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                                   size="small"
                                                   @click="handleAddCousin()"

                                        ></el-button>
                                        <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                                   size="small"
                                                   @click="removeCousinData(scope.$index,scope.row)"
                                        ></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>

                        <p><b><i class="material-icons">
                            school
                        </i> {{langConfig['study']}}</b></p>
                        <hr>
                        <el-row>
                            <el-table
                                    :data="studyData"
                                    stripe
                                    style="width: 100%">
                                <el-table-column
                                        type="index"
                                        :index="indexMethod">
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['studyAt']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.studyAt"
                                                  :placeholder="langConfig['studyAt']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['duration']"
                                >
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.duration"
                                                  :placeholder="langConfig['duration']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['grade']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.grade"
                                                  :placeholder="langConfig['grade']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['where']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.where"
                                                  :placeholder="langConfig['where']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="graduatedYear"
                                        :label="langConfig['graduatedYear']">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.graduatedYear"
                                                  :placeholder="langConfig['graduatedYear']"
                                                  @change="handleEditStudy(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        :label="langConfig['action']"
                                        width="120"
                                >
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                                   size="small"
                                                   @click="handleAddStudy()"

                                        ></el-button>
                                        <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                                   size="small"
                                                   @click="removeStudy(scope.$index,scope.row)"
                                        ></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                        <br>
                        <br>
                        <el-form-item :label="langConfig['personalContract']" prop="personalContract">
                            <el-input type="textarea" v-model="schStudentForm.personalContract"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer fix-dialog-footer"
            >
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger" @click="dialogUpdateSchStudent= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['cancel']}}</el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right">
                         <el-button type="primary" @click.native="updateSchStudent(schStudentId)"><i
                                 class="el-icon-circle-check"> </i>&nbsp; {{langConfig['save']}}</el-button>
                    </el-col>
                </el-row>
            </span>
        </el-dialog>


        <el-dialog
                :title="langConfig['inputTranscript']"
                :visible.sync="dialoginputTranscript"
                :fullscreen="fullscreen">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="inputTranscriptForm" :rules="rules" ref="inputTranscriptForm" label-width="120px"
                     class="inputTranscriptForm">

                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="langConfig['name']" prop="studentName">
                            <input type="hidden" v-model="inputTranscriptForm.studentId"/>
                            <el-input v-model="inputTranscriptForm.studentName" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="langConfig['major']" prop="majorId">
                            <el-select style="display: block !important;"
                                       filterable :disabled="true"
                                       v-model="inputTranscriptForm.majorId"
                                       :placeholder="langConfig['chooseItem']">
                                <el-option
                                        v-for="item in majorList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="langConfig['curiculumn']" prop="curiculumnId">
                            <el-select style="display: block !important;"
                                       filterable
                                       v-model="inputTranscriptForm.curiculumnId" :disabled="disabledCuriculumn"
                                       :placeholder="langConfig['chooseItem']">
                                <el-option
                                        v-for="item in curiculumnList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="11">
                        <span><b>ឆមាស ១(Semester 1)</b></span>
                        <el-table
                                :data="culumnData1"
                                stripe
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['year']">
                                <template slot-scope="scope">

                                    <el-select style="display: block !important;"
                                               filterable
                                               v-model="scope.row.year" :disabled="true"
                                               @change="handleEditCulumn1(scope.$index, scope.row)"
                                               :placeholder="langConfig['chooseItem']">
                                        <el-option
                                                v-for="item in yearList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['subject']">
                                <template slot-scope="scope">
                                    <el-select style="display: block !important;"
                                               filterable
                                               v-model="scope.row.subjectId" :disabled="true"
                                               @change="handleEditCulumn1(scope.$index, scope.row)"
                                               :placeholder="langConfig['chooseItem']">
                                        <el-option
                                                v-for="item in subjectList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['credit']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.credit" type="number"
                                              :placeholder="langConfig['credit']" :disabled="true"
                                              @keyup.native="handleEditCulumn1(scope.$index, scope.row)"
                                              @change="handleEditCulumn1(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['score']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.score" type="number"
                                              :placeholder="langConfig['score']"
                                              @keyup.native="handleEditCulumn1(scope.$index, scope.row)"
                                              @change="handleEditCulumn1(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['grades']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.grade"
                                              :placeholder="langConfig['grades']" disabled
                                              @keyup.native="handleEditCulumn1(scope.$index, scope.row)"
                                              @change="handleEditCulumn1(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-col>
                    <el-col :span="2">
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="11">
                        <span><b>ឆមាស ២(Semester 2)</b></span>
                        <el-table
                                :data="culumnData2"
                                stripe
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['year']">
                                <template slot-scope="scope">

                                    <el-select style="display: block !important;"
                                               filterable
                                               v-model="scope.row.year" :disabled="true"
                                               @change="handleEditCulumn2(scope.$index, scope.row)"
                                               :placeholder="langConfig['chooseItem']">
                                        <el-option
                                                v-for="item in yearList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['subject']">
                                <template slot-scope="scope">
                                    <el-select style="display: block !important;"
                                               filterable
                                               v-model="scope.row.subjectId" :disabled="true"
                                               @change="handleEditCulumn2(scope.$index, scope.row)"
                                               :placeholder="langConfig['chooseItem']">
                                        <el-option
                                                v-for="item in subjectList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['credit']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.credit" type="number"
                                              :placeholder="langConfig['credit']" :disabled="true"
                                              @keyup.native="handleEditCulumn2(scope.$index, scope.row)"
                                              @change="handleEditCulumn2(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    :label="langConfig['score']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.score" type="number"
                                              :placeholder="langConfig['score']"
                                              @keyup.native="handleEditCulumn2(scope.$index, scope.row)"
                                              @change.native="handleEditCulumn2(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['grades']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.grade"
                                              :placeholder="langConfig['grade']" disabled
                                              @keyup.native="handleEditCulumn1(scope.$index, scope.row)"
                                              @change="handleEditCulumn1(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="11">
                        <span><b>ប្រលងបញ្ចប់(State Exam)</b></span>
                        <el-table
                                :data="stateExam"
                                stripe
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    :index="indexMethod">
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['subject']">
                                <template slot-scope="scope">
                                    <el-select style="display: block !important;"
                                               filterable
                                               v-model="scope.row.subjectId"
                                               @change="handleEditStateExam(scope.$index, scope.row)"
                                               :placeholder="langConfig['chooseItem']">
                                        <el-option
                                                v-for="item in subjectList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['score']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.score" type="number"
                                              :placeholder="langConfig['score']"
                                              @keyup.native="handleEditStateExam(scope.$index, scope.row)"
                                              @change.native="handleEditStateExam(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['grades']">
                                <template slot-scope="scope">
                                    <el-input size="small" v-model="scope.row.grade"
                                              :placeholder="langConfig['grades']" disabled
                                              @keyup.native="handleEditStateExam(scope.$index, scope.row)"
                                              @change="handleEditStateExam(scope.$index, scope.row)"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :label="langConfig['action']"
                                    width="120"
                            >
                                <template slot-scope="scope">
                                    <el-button type="primary" class="cursor-pointer" icon="el-icon-circle-plus"
                                               size="small"
                                               @click="handleAddStateExam()"

                                    ></el-button>
                                    <el-button type="danger" class="cursor-pointer" icon="el-icon-remove"
                                               size="small"
                                               @click="removeStateExam(scope.$index,scope.row)"
                                    ></el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-col>
                    <el-col :span="2">
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item :label="langConfig['finalGrade']" prop="finalGrade">
                            <el-input v-model="inputTranscriptForm.finalGrade"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <hr>
            </el-form>
            <span slot="footer" class="dialog-footer fix-dialog-footer"
            >
                <hr style="margin-top: 0px !important;">
                 <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger" @click="dialoginputTranscript= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['cancel']}}</el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right">
                         <el-button type="primary" @click.native="saveTranscript"><i
                                 class="el-icon-circle-check"> </i>&nbsp; {{langConfig['save']}}</el-button>
                    </el-col>
                </el-row>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import compoLang from '../../../both/i18n/lang/elem-label-sch'

    export default {
        meteor: {
            langSession() {
                return Session.get('lang') || "en";
            },
            disabledRemove() {
                return Session.get("canRemove");
            },
            disabledUpdate() {
                return Session.get("canUpdate");
            }
        },
        data() {
            return {
                fullscreen: true,
                langSession: null,
                schStudentData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddSchStudent: false,
                dialogUpdateSchStudent: false,
                dialoginputTranscript: false,
                schStudentId: "",
                cousinData: [{
                    name: "",
                    gender: "",
                    age: "",
                    occupation: ""
                }],
                studyData: [{
                    studyAt: "",
                    duration: "",
                    grade: "Un Range",
                    where: "",
                    graduatedYear: "",
                }],
                levelList: [
                    {label: "អនុបណ្ឌិត", value: "master"},
                    {label: "បរិញ្ញាបត្របច្ចេកវិទ្យាបន្តឆ្នាំទី៣", value: "bachelor3"},
                    {label: "បរិញ្ញាបត្របច្ចេកវិទ្យាឆ្នាំទី១", value: "bachelor1"},
                    {label: "បរិញ្ញាបត្ររង", value: "associate"},
                    {label: "សញ្ញាបត្របច្ចេកទេសវិជ្ជាជីវៈ", value: "level"}]
                ,
                yearList: [
                    {label: "1", value: 1},
                    {label: "2", value: 2},
                    {label: "3", value: 3},
                    {label: "4", value: 4},
                ],
                majorList: [],
                subjectList: [],

                genderList: [
                    {value: "Male", label: "Male"},
                    {value: "Female", label: "Female"}
                ],
                statusList:
                    [
                        {value: "Single", label: "Single"},
                        {value: "Married", label: "Married"}
                    ],
                schStudentForm:
                    {
                        name: "",
                        latinName:
                            "",
                        gender:
                            "",
                        nationality:
                            "",
                        nation:
                            "",
                        status:
                            "",
                        dob:
                            "",
                        dobName:
                            "",

                        village:
                            "",
                        commune:
                            "",
                        district:
                            "",
                        province:
                            "",
                        homeNoCurrent:
                            "",
                        groupCurrent:
                            "",
                        villageCurrent:
                            "",
                        communeCurrent:
                            "",
                        districtCurrent:
                            "",
                        provinceCurrent:
                            "",
                        occupation:
                            "",
                        occupationPlace:
                            "",

                        degree:
                            "",
                        degreeYear:
                            "",
                        phoneNumber:
                            "",

                        faName:
                            "",
                        faYob:
                            "",
                        faNationality:
                            "",
                        faNation:
                            "",
                        faIsDie:
                            false,
                        faOccupation:
                            "",

                        moName:
                            "",
                        moYob:
                            "",
                        moNationality:
                            "",
                        moNation:
                            "",
                        moIsDie:
                            false,
                        moOccupation:
                            "",
                        address:
                            "",

                        cousin:
                            [],
                        personalStudy:
                            [],
                        personalContract:
                            "",
                        level:
                            "",
                        majorId:
                            "",
                        fromSchool: "",
                        provinceSchool: "",
                        yearFrom: "",
                        yearTo: ""

                    }
                ,
                rules: {
                    "name":
                        [{required: true, message: 'Please input name', trigger: 'blur'}],
                    "latinName":
                        [{required: true, message: 'Please input latin name', trigger: 'blur'}],
                    majorId:
                        [{
                            required: true,
                            type: 'string',
                            message: 'Please choose Major',
                            trigger: 'change'
                        }],
                    level:
                        [{
                            required: true,
                            type: 'string',
                            message: 'Please choose Major',
                            trigger: 'change'
                        }]

                }
                ,
                inputTranscriptForm: {
                    majorId: "",
                    curiculumnId: "",
                    culumnSemester1: [],
                    culumnSemester2: [],
                    studentName: "",
                    studentId: "",
                    finalGrade: "",
                    transcriptId: ""
                },
                culumnData1: [
                    {year: "", subjectId: "", credit: 0, score: 0, grade: "Un Range"}
                ],
                culumnData2: [
                    {year: "", subjectId: "", credit: 0, score: 0, grade: "Un Range"}
                ],
                stateExam: [
                    {subjectId: "", score: 0, grade: "Un Range"}
                ],
                curiculumnList: [],
                mentionRange: [],
                disabledCuriculumn: false
            }
        },
        watch: {
            currentSize(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * val;
                this.queryData(this.searchData, skip, val + skip);
            },
            currentPage(val) {
                this.isSearching = true;
                let skip = (val - 1) * this.currentSize;
                this.queryData(this.searchData, skip, this.currentSize + skip);
            },
            searchData(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * this.currentSize;
                this.queryData(val, skip, this.currentSize + skip);
            },
            "inputTranscriptForm.curiculumnId"(val) {

                if (this.inputTranscriptForm.transcriptId === "") {
                    this.findCuriculumnById(val);
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('querySchStudent', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.schStudentData = result.content;
                        this.count = result.countSchStudent;
                    }
                    this.isSearching = false;
                });
            }, 300),
            indexMethod(index) {
                return index + 1;
            },
            handleAddCousin() {
                this.cousinData.push({
                    name: "",
                    gender: "",
                    age: "",
                    occupation: ""
                })
            },
            handleEditCousin(row, index) {
                this.cousinData[index] = row;
            },
            removeCousinData(index, row) {
                if (this.cousinData.length > 1) {
                    this.cousinData.splice(index, 1);
                    this.$message({
                        message: `លុប ${row.name} បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.cousinData = [{
                        name: "",
                        gender: "",
                        age: "",
                        occupation: ""
                    }];
                }
            },

            handleAddStudy() {
                this.studyData.push({
                    studyAt: "",
                    duration: "",
                    grade: "",
                    where: "",
                    graduatedYear: "",

                })
            },
            handleEditStudy(index, row) {
                this.studyData[index] = row;

            },
            majorOpt() {
                let selector = {};
                Meteor.call('queryMajorOption', selector, (err, result) => {
                    this.majorList = result;
                })
            },
            ciriculumnOpt(val) {
                let selector = {};
                selector.majorId = val;
                Meteor.call('queryCiriculumnOption', selector, (err, result) => {
                    this.curiculumnList = result;
                })
            },
            removeStudy(index, row) {
                if (this.studyData.length > 1) {
                    this.studyData.splice(index, 1);
                    this.$message({
                        message: `លុប ${row.studyAt} បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.studyData = [{
                        studyAt: "",
                        duration: "",
                        grade: "",
                        where: "",
                        graduatedYear: "",
                    }];
                }
            },
            saveSchStudent() {
                let vm = this;
                this.$refs["schStudentFormAdd"].validate((valid) => {
                    if (valid) {

                        let personal = {
                            name: vm.schStudentForm.name,
                            latinName: vm.schStudentForm.latinName,
                            gender: vm.schStudentForm.gender,
                            nationality: vm.schStudentForm.nationality,
                            nation: vm.schStudentForm.nation,
                            status: vm.schStudentForm.status,
                            dob: vm.schStudentForm.dob,
                            dobName: moment(vm.schStudentForm.dob).format("DD//MM/YYYY"),
                            homeNo: vm.schStudentForm.homeNo,
                            village: vm.schStudentForm.village,
                            commune: vm.schStudentForm.commune,
                            district: vm.schStudentForm.district,
                            province: vm.schStudentForm.province,
                            occupation: vm.schStudentForm.occupation,
                            homeNoCurrent: vm.schStudentForm.homeNoCurrent,
                            groupCurrent: vm.schStudentForm.groupCurrent,
                            villageCurrent: vm.schStudentForm.villageCurrent,
                            communeCurrent: vm.schStudentForm.communeCurrent,
                            districtCurrent: vm.schStudentForm.districtCurrent,
                            provinceCurrent: vm.schStudentForm.provinceCurrent,
                            occupationPlace: vm.schStudentForm.occupationPlace,

                            degree: vm.schStudentForm.degree,
                            degreeYear: vm.schStudentForm.degreeYear,
                            phoneNumber: vm.schStudentForm.phoneNumber
                        };


                        let family = {};
                        let personalStudy = [];
                        let cousin = [];

                        this.studyData.map((obj) => {
                            if (obj.studyAt) {
                                personalStudy.push(obj)
                            }
                        })

                        this.cousinData.map((obj) => {
                            if (obj.name) {
                                cousin.push(obj);
                            }
                        });

                        let parent = {
                            faName: vm.schStudentForm.faName,
                            faYob: vm.schStudentForm.faYob,
                            faNationality: vm.schStudentForm.faNationality,
                            faNation: vm.schStudentForm.faNation,
                            faIsDie: vm.schStudentForm.faIsDie,
                            faOccupation: vm.schStudentForm.faOccupation,

                            moName: vm.schStudentForm.moName,
                            moYob: vm.schStudentForm.moYob,
                            moNationality: vm.schStudentForm.moNationality,
                            moNation: vm.schStudentForm.moNation,
                            moIsDie: vm.schStudentForm.moIsDie,
                            moOccupation: vm.schStudentForm.moOccupation,
                            address: vm.schStudentForm.address,
                        };
                        family.parent = parent;
                        family.cousin = cousin;
                        let schStudentDoc = {
                            personal: personal,
                            family: family,
                            personalStudy: personalStudy,
                            personalContract: vm.schStudentForm.personalContract,
                            level: vm.schStudentForm.level,
                            majorId: vm.schStudentForm.majorId,
                            fromSchool: vm.schStudentForm.fromSchool,
                            provinceSchool: vm.schStudentForm.provinceSchool,
                            yearFrom: vm.schStudentForm.yearFrom,
                            yearTo: vm.schStudentForm.yearTo,

                            rolesArea: Session.get('area')
                        };

                        Meteor.call("insertSchStudent", schStudentDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: this.langConfig['saveSuccess'],
                                    type: 'success'
                                });
                                vm.dialogAddSchStudent = false;
                                vm.queryData();

                                vm.$refs["schStudentFormAdd"].resetFields();
                                vm.resetForm();

                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: err.message,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            updateSchStudent(_id) {
                let vm = this;
                this.$refs["schStudentFormUpdate"].validate((valid) => {
                    if (valid) {
                        let personal = {
                            name: vm.schStudentForm.name,
                            latinName: vm.schStudentForm.latinName,
                            gender: vm.schStudentForm.gender,
                            nationality: vm.schStudentForm.nationality,
                            nation: vm.schStudentForm.nation,
                            status: vm.schStudentForm.status,
                            dob: vm.schStudentForm.dob,
                            dobName: moment(vm.schStudentForm.dob).format("DD//MM/YYYY"),
                            homeNo: vm.schStudentForm.homeNo,
                            village: vm.schStudentForm.village,
                            commune: vm.schStudentForm.commune,
                            district: vm.schStudentForm.district,
                            province: vm.schStudentForm.province,
                            occupation: vm.schStudentForm.occupation,
                            homeNoCurrent: vm.schStudentForm.homeNoCurrent,
                            groupCurrent: vm.schStudentForm.groupCurrent,
                            villageCurrent: vm.schStudentForm.villageCurrent,
                            communeCurrent: vm.schStudentForm.communeCurrent,
                            districtCurrent: vm.schStudentForm.districtCurrent,
                            provinceCurrent: vm.schStudentForm.provinceCurrent,
                            occupationPlace: vm.schStudentForm.occupationPlace,

                            degree: vm.schStudentForm.degree,
                            degreeYear: vm.schStudentForm.degreeYear,
                            phoneNumber: vm.schStudentForm.phoneNumber
                        };


                        let family = {};


                        let personalStudy = [];
                        let cousin = [];

                        this.studyData.map((obj) => {
                            if (obj.studyAt) {
                                personalStudy.push(obj)
                            }
                        });

                        this.cousinData.map((obj) => {
                            if (obj.name) {
                                cousin.push(obj);
                            }
                        });

                        let parent = {
                            faName: vm.schStudentForm.faName,
                            faYob: vm.schStudentForm.faYob,
                            faNationality: vm.schStudentForm.faNationality,
                            faNation: vm.schStudentForm.faNation,
                            faIsDie: vm.schStudentForm.faIsDie,
                            faOccupation: vm.schStudentForm.faOccupation,

                            moName: vm.schStudentForm.moName,
                            moYob: vm.schStudentForm.moYob,
                            moNationality: vm.schStudentForm.moNationality,
                            moNation: vm.schStudentForm.moNation,
                            moIsDie: vm.schStudentForm.moIsDie,
                            moOccupation: vm.schStudentForm.moOccupation,
                            address: vm.schStudentForm.address,
                        };
                        family.parent = parent;
                        family.cousin = cousin;
                        let schStudentDoc = {
                            personal: personal,
                            family: family,
                            personalStudy: personalStudy,
                            personalContract: vm.schStudentForm.personalContract,
                            level: vm.schStudentForm.level,
                            majorId: vm.schStudentForm.majorId,
                            fromSchool: vm.schStudentForm.fromSchool,
                            provinceSchool: vm.schStudentForm.provinceSchool,
                            yearFrom: vm.schStudentForm.yearFrom,
                            yearTo: vm.schStudentForm.yearTo,
                            rolesArea: Session.get('area'),
                            _id: _id
                        };

                        Meteor.call("updateSchStudent", schStudentDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: this.langConfig['updateSuccess'],
                                    type: 'success'
                                });
                                vm.dialogUpdateSchStudent = false;
                                vm.queryData();

                                vm.$refs["schStudentFormUpdate"].resetFields();
                                vm.resetForm();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: this.langConfig['updateFail'],
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            removeSchStudent(index, row, rows) {
                let vm = this;
                this.$confirm(this.langConfig['messageWarning'], this.langConfig['warning'], {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeSchStudent", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `${row.name}` + this.langConfig['removeSuccess'],
                                type: 'success'
                            });


                        } else {
                            vm.$message({
                                type: 'error',
                                message: this.langConfig['removeFail']
                            });
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.langConfig['cancel']
                    });
                });

            },
            findSchStudentById(doc) {
                let vm = this;
                Meteor.call("querySchStudentById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schStudentId = result._id;
                        vm.schStudentForm.personal = result.personal;


                        vm.schStudentForm.name = result.personal.name;
                        vm.schStudentForm.latinName = result.personal.latinName;
                        vm.schStudentForm.gender = result.personal.gender;
                        vm.schStudentForm.nationality = result.personal.nationality;
                        vm.schStudentForm.nation = result.personal.nation;
                        vm.schStudentForm.status = result.personal.status;
                        vm.schStudentForm.dob = result.personal.dob;
                        vm.schStudentForm.village = result.personal.village;
                        vm.schStudentForm.commune = result.personal.commune;
                        vm.schStudentForm.district = result.personal.district;
                        vm.schStudentForm.province = result.personal.province;
                        vm.schStudentForm.homeNoCurrent = result.personal.homeNoCurrent;
                        vm.schStudentForm.groupCurrent = result.personal.groupCurrent;
                        vm.schStudentForm.villageCurrent = result.personal.villageCurrent;
                        vm.schStudentForm.communeCurrent = result.personal.communeCurrent;
                        vm.schStudentForm.districtCurrent = result.personal.districtCurrent;
                        vm.schStudentForm.provinceCurrent = result.personal.provinceCurrent;
                        vm.schStudentForm.occupation = result.personal.occupation;
                        vm.schStudentForm.occupationPlace = result.personal.occupationPlace;
                        vm.schStudentForm.degree = result.personal.degree;
                        vm.schStudentForm.degreeYear = result.personal.degreeYear;
                        vm.schStudentForm.phoneNumber = result.personal.phoneNumber;


                        vm.studyData = result.personalStudy;
                        vm.cousinData = result.family.cousin;

                        vm.schStudentForm.faName = result.family.parent.faName;
                        vm.schStudentForm.faYob = result.family.parent.faYob;
                        vm.schStudentForm.faNationality = result.family.parent.faNationality;
                        vm.schStudentForm.faNation = result.family.parent.faNation;
                        vm.schStudentForm.faIsDie = result.family.parent.faIsDie;
                        vm.schStudentForm.faOccupation = result.family.parent.faOccupation;

                        vm.schStudentForm.moName = result.family.parent.moName;
                        vm.schStudentForm.moYob = result.family.parent.moYob;
                        vm.schStudentForm.moNationality = result.family.parent.moNationality;
                        vm.schStudentForm.moNation = result.family.parent.moNation;
                        vm.schStudentForm.moIsDie = result.family.parent.moIsDie;
                        vm.schStudentForm.moOccupation = result.family.parent.moOccupation;
                        vm.schStudentForm.address = result.family.parent.address;

                        vm.schStudentForm.personalContract = result.personalContract;
                        vm.schStudentForm.level = result.level;
                        vm.schStudentForm.majorId = result.majorId;
                        vm.schStudentForm.fromSchool = result.fromSchool;
                        vm.schStudentForm.provinceSchool = result.provinceSchool;
                        vm.schStudentForm.yearFrom = result.yearFrom;
                        vm.schStudentForm.yearTo = result.yearTo;


                    }
                })
            },
            cancel() {
                this.$message({
                    type: 'info',
                    message: this.langConfig['cancel']
                });
            },
            resetForm() {
                this.schStudentForm._id = "";
                this.inputTranscriptForm = {};
                this.cousinData =
                    [{
                        name: "",
                        gender: "",
                        age: "",
                        occupation: ""
                    }];
                this.studyData =
                    [{
                        studyAt: "",
                        duration: "",
                        grade: "",
                        where: "",
                        graduatedYear: "",
                    }];

                this.culumnData1 = [
                    {year: "", subjectId: "", credit: 0, score: 0, grade: "Un Range"}
                ];
                this.culumnData2 = [
                    {year: "", subjectId: "", credit: 0, score: 0, grade: "Un Range"}
                ];
                this.stateExam = [
                    {subjectId: "", score: 0, grade: "Un Range"}
                ];
                if (this.$refs["schStudentFormAdd"]) {
                    this.$refs["schStudentFormAdd"].resetFields();
                    this.schStudentForm = {
                        name: "",
                        latinName: "",
                        gender: "",
                        nationality: "",
                        nation: "",
                        status: "",
                        dob: "",

                        village: "",
                        commune: "",
                        district: "",
                        province: "",
                        homeNoCurrent: "",
                        groupCurrent: "",
                        villageCurrent: "",
                        communeCurrent: "",
                        districtCurrent: "",
                        provinceCurrent: "",
                        occupation: "",
                        occupationPlace: "",

                        degree: "",
                        degreeYear: "",
                        phoneNumber: "",

                        faName: "",
                        faYob: "",
                        faNationality: "",
                        faNation: "",
                        faIsDie: false,
                        faOccupation: "",

                        moName: "",
                        moYob: "",
                        moNationality: "",
                        moNation: "",
                        moIsDie: false,
                        moOccupation: "",
                        address: "",

                        cousin: [],
                        personalStudy: [],
                        personalContract: "",
                        level:
                            "",
                        majorId:
                            "",
                        fromSchool: "",
                        provinceSchool: "",
                        yearFrom: "",
                        yearTo: ""

                    };
                }

                if (this.$refs["schStudentFormUpdate"]) {
                    this.$refs["schStudentFormUpdate"].resetFields();
                    this.schStudentForm = {
                        name: "",
                        latinName: "",
                        gender: "",
                        nationality: "",
                        nation: "",
                        status: "",
                        dob: "",

                        village: "",
                        commune: "",
                        district: "",
                        province: "",
                        homeNoCurrent: "",
                        groupCurrent: "",
                        villageCurrent: "",
                        communeCurrent: "",
                        districtCurrent: "",
                        provinceCurrent: "",
                        occupation: "",
                        occupationPlace: "",

                        degree: "",
                        degreeYear: "",
                        phoneNumber: "",

                        faName: "",
                        faYob: "",
                        faNationality: "",
                        faNation: "",
                        faIsDie: false,
                        faOccupation: "",

                        moName: "",
                        moYob: "",
                        moNationality: "",
                        moNation: "",
                        moIsDie: false,
                        moOccupation: "",
                        address: "",

                        cousin: [],
                        personalStudy: [],
                        personalContract: "",
                        level:
                            "",
                        majorId:
                            "",
                        fromSchool: "",
                        provinceSchool: "",
                        yearFrom: "",
                        yearTo: ""

                    };

                }

            },
            findCuriculumnById(id) {
                Meteor.call("querySchCiriculumnById", id, (err, result) => {
                    if (result) {

                        result.culumnSemester1.map((obj) => {
                            obj.score = 0;
                            obj.grade = "Un Range";
                        });
                        this.culumnData1 = result.culumnSemester1;

                        result.culumnSemester2.map((obj) => {
                            obj.score = 0;
                            obj.grade = "Un Range";
                        });
                        this.culumnData2 = result.culumnSemester2;
                    }
                })
            },
            saveTranscript() {
                let vm = this;
                this.$refs["inputTranscriptForm"].validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.studentId = vm.inputTranscriptForm.studentId;
                        data.majorId = vm.inputTranscriptForm.majorId;
                        data.curiculumnId = vm.inputTranscriptForm.curiculumnId;
                        data.culumnSemester1 = vm.culumnData1;
                        data.culumnSemester2 = vm.culumnData2;
                        let stateList = [];
                        this.stateExam.map((obj) => {
                            if (obj.subjectId) {
                                stateList.push(obj)
                            }
                        });
                        data.state = stateList;
                        data.finalGrade = vm.inputTranscriptForm.finalGrade;
                        data.rolesArea = Session.get('area');

                        Meteor.call("inputTranscript", data, (err, result) => {
                            if (result !== false) {
                                vm.$message({
                                    duration: 1000,
                                    message: this.langConfig['saveSuccess'],
                                    type: 'success'
                                });
                                vm.dialoginputTranscript = false;
                                vm.queryData();

                                vm.$refs["inputTranscriptForm"].resetFields();
                                vm.resetForm();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: err.message,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            removeCulumn1(index, row) {
                if (this.culumnData1.length > 1) {
                    this.culumnData1.splice(index, 1);
                    this.$message({
                        message: `លុប បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.culumnData1 = [
                        {year: "", subjectId: "", credit: 0, grade: "Un Range"}

                    ];
                }
            },

            handleAddCulumn1() {
                this.culumnData1.push(
                    {year: "", subjectId: "", credit: 0, grade: "Un Range"}
                )
            },
            handleEditCulumn1(index, row) {
                let gradeDoc = this.getMentionByScore(row.score);
                row.grade = gradeDoc.grade;
                this.culumnData1[index] = row;
            },
            removeCulumn2(index, row) {
                if (this.culumnData2.length > 1) {
                    this.culumnData2.splice(index, 1);
                    this.$message({
                        message: `លុប បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.culumnData2 = [
                        {year: "", subjectId: "", credit: 0, grade: "Un Range"}

                    ];
                }
            },

            handleAddCulumn2() {
                this.culumnData2.push(
                    {year: "", subjectId: "", credit: 0, grade: "Un Range"}
                )
            },
            handleEditCulumn2(index, row) {
                let gradeDoc = this.getMentionByScore(row.score);
                row.grade = gradeDoc.grade;
                this.culumnData2[index] = row;
            },

            removeStateExam(index, row) {
                if (this.stateExam.length > 1) {
                    this.stateExam.splice(index, 1);
                    this.$message({
                        message: `លុប បានជោគជ័យ`,
                        type: 'success'
                    });
                } else {
                    this.stateExam = [
                        {subjectId: "", score: 0, grade: "Un Range"}
                    ];
                }
            },

            handleAddStateExam() {
                this.stateExam.push(
                    {subjectId: "", score: 0, grade: "Un Range"}
                )
            },
            handleEditStateExam(index, row) {
                let gradeDoc = this.getMentionByScore(row.score);
                row.grade = gradeDoc.grade;
                this.stateExam[index] = row;
            },
            subjectOpt() {
                let selector = {};
                Meteor.call('querySubjectOption', selector, (err, result) => {
                    this.subjectList = result;
                })
            },
            popUpInputTranscript(data) {
                let vm = this;
                vm.resetForm();
                this.inputTranscriptForm.studentName = data.personal.name;
                this.inputTranscriptForm.studentId = data._id;
                this.inputTranscriptForm.majorId = data.majorId;
                this.ciriculumnOpt(data.majorId);
                vm.inputTranscriptForm.transcriptId = "";
                vm.disabledCuriculumn = false;
                Meteor.call("queryTranscriptByStudentIdMajorId", data._id, data.majorId, (err, result) => {
                    if (result) {
                        vm.inputTranscriptForm.curiculumnId = result.curiculumnId;
                        vm.inputTranscriptForm.transcriptId = result._id;

                        vm.culumnData1 = result.culumnSemester1;
                        vm.culumnData2 = result.culumnSemester2;
                        vm.stateExam = result.state;
                        vm.disabledCuriculumn = true;
                    }
                });

            },
            getMention() {
                Meteor.call("querySchMentionByActive", Session.get("area"), (err, result) => {
                    if (result) {
                        this.mentionRange = result.range;
                    }
                });
            },
            getMentionByScore(val) {
                val = parseFloat(val) || 0;

                function checkMention(range) {
                    return range.from <= val && range.to > val;
                }

                let data = this.mentionRange.find(checkMention);
                if (data === null || data === undefined) {
                    let newData = {};
                    newData.grade = "Un Range";
                    return newData;
                }
                return data;
            },
            printTranscript(data) {
                FlowRouter.go('/sch-data/schTranscript/print?studentId=' + data._id + '&majorId=' + data.majorId);
            }
        },
        created() {
            this.isSearching = true;
            this.queryData();
            this.majorOpt();
            this.subjectOpt();
            this.getMention();
        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['student'];
                return data;
            }
        }
    }
</script>