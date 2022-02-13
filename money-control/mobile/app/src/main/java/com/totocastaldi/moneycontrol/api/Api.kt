package com.totocastaldi.moneycontrol.api

import com.totocastaldi.moneycontrol.model.Extra
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Query

interface Api {

    @GET( "budget-extra")
    suspend fun getExtraBudget(@Query("interval") interval : String,
                               @Query("total_budget") totalBudget : String,
                               @Query("extras") extras : List<String>,
                               @Header("Authorization") authHeader : String
    ): Response<Extra>
}