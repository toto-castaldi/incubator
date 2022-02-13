package com.totocastaldi.moneycontrol.repository

import com.totocastaldi.moneycontrol.api.RetrofitInstance
import com.totocastaldi.moneycontrol.model.Extra
import retrofit2.Response

class Repository {

    suspend fun getExtraBudget(idToken : String): Response<Extra> {
        return RetrofitInstance.api.getExtraBudget("31", "1643", listOf("Extra", "Svago"), idToken)
    }
}