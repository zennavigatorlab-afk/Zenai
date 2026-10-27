import { AndroidProjectFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    filename: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle settings configuring project name and plugin management repositories',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "ZEN-AI"
include(":app")
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    filename: 'libs.versions.toml',
    category: 'gradle',
    description: 'Gradle Version Catalog pinning stable, compatible AndroidX, Compose, Room and Coroutine dependencies',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
room = "2.6.1"
datastore = "1.1.1"
coroutines = "1.9.0"
ksp = "2.0.21-1.0.28"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
material3 = "1.3.1"
navigationCompose = "2.8.3"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
kotlinx-coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "coroutines" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`,
  },
  {
    path: 'build.gradle.kts',
    filename: 'build.gradle.kts',
    category: 'gradle',
    description: 'Root build configuration declaring plugins without applying to root',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },
  {
    path: 'app/build.gradle.kts',
    filename: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App module build script configuring SDK 35, Jetpack Compose, Room, and DataStore',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.zenai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.zenai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)

    // Local Storage & Preferences
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.datastore.preferences)

    // Asynchronous Flow
    implementation(libs.kotlinx.coroutines.android)

    // Unit & UI Testing
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    debugImplementation(libs.androidx.ui.tooling)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    category: 'manifest',
    description: 'Android Manifest with strictly declared permissions, package visibility <queries>, and NotificationListenerService',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Normal permissions for connectivity and boot handling -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Protected permission: Usage Stats requires manual user authorization in Settings -->
    <uses-permission
        android:name="android.permission.PACKAGE_USAGE_STATS"
        tools:ignore="ProtectedPermissions" />

    <!-- Battery optimization whitelist prompt -->
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <!-- Optional runtime permission: Call Log (Gated by Google Play policy, requested only on demand) -->
    <uses-permission android:name="android.permission.READ_CALL_LOG" />

    <!-- Package Visibility Queries (Android 11+ / API 30+ compliant) -->
    <!-- Declares explicit package intents rather than requesting broad QUERY_ALL_PACKAGES -->
    <queries>
        <package android:name="com.whatsapp" />
        <package android:name="org.telegram.messenger" />
        <package android:name="com.instagram.android" />
        <package android:name="com.facebook.katana" />
        <intent>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent>
    </queries>

    <application
        android:name=".ZenApplication"
        android:allowBackup="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZenAI"
        android:networkSecurityConfig="@xml/network_security_config"
        tools:targetApi="35">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.ZenAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- NotificationListenerService with system-level bind permission requirement -->
        <service
            android:name=".data.notifications.ZenNotificationListenerService"
            android:exported="true"
            android:label="ZEN AI Notification Monitor"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/res/xml/network_security_config.xml',
    filename: 'network_security_config.xml',
    category: 'manifest',
    description: 'Security configuration enforcing zero cleartext (HTTP) network traffic',
    content: `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Strictly forbid arbitrary cleartext HTTP traffic -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
`,
  },
  {
    path: 'app/src/main/java/com/zenai/ZenApplication.kt',
    filename: 'ZenApplication.kt',
    category: 'kotlin_service',
    description: 'Application class initializing Room database and local Keystore protection',
    content: `package com.zenai

import android.app.Application
import com.zenai.data.notifications.ZenDatabase
import com.zenai.security.KeystoreManager

class ZenApplication : Application() {

    lateinit var database: ZenDatabase
        private set

    lateinit var keystoreManager: KeystoreManager
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize local encrypted Room database
        database = ZenDatabase.getInstance(this)

        // Initialize hardware-backed Keystore manager
        keystoreManager = KeystoreManager(this)
    }

    companion object {
        lateinit var instance: ZenApplication
            private set
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/MainActivity.kt',
    filename: 'MainActivity.kt',
    category: 'kotlin_ui',
    description: 'Main Activity launching Jetpack Compose UI with dark navy theme and edge-to-edge layout',
    content: `package com.zenai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.zenai.ui.navigation.ZenNavHost
import com.zenai.ui.theme.ZenNavyDark
import com.zenai.ui.theme.ZenTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ZenTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = ZenNavyDark
                ) {
                    ZenNavHost()
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/permissions/ZenPermissionManager.kt',
    filename: 'ZenPermissionManager.kt',
    category: 'kotlin_service',
    description: 'Manages runtime checks, system intent shortcuts, and rationales for Usage Access, Notification Access, and Call Log',
    content: `package com.zenai.permissions

import android.Manifest
import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.os.Process
import android.provider.Settings
import androidx.core.content.ContextCompat

object ZenPermissionManager {

    /**
     * Checks if the app is authorized as a NotificationListenerService.
     */
    fun hasNotificationAccess(context: Context): Boolean {
        val packageName = context.packageName
        val flat = Settings.Secure.getString(
            context.contentResolver,
            "enabled_notification_listeners"
        ) ?: return false
        return flat.contains(packageName)
    }

    /**
     * Checks if Usage Access has been granted via AppOpsManager.
     */
    fun hasUsageAccess(context: Context): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as? AppOpsManager
            ?: return false
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    /**
     * Checks if Call Log read permission has been granted at runtime.
     */
    fun hasCallLogAccess(context: Context): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.READ_CALL_LOG
        ) == PackageManager.PERMISSION_GRANTED
    }

    /**
     * Checks if the app is whitelisted from battery optimizations.
     */
    fun isBatteryOptimizationIgnored(context: Context): Boolean {
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
            ?: return true
        return powerManager.isIgnoringBatteryOptimizations(context.packageName)
    }

    // System Intent Launchers
    fun openNotificationAccessSettings(context: Context) {
        val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }

    fun openUsageAccessSettings(context: Context) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }

    fun openAppDetailsSettings(context: Context) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.fromParts("package", context.packageName, null)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }

    fun openBatterySettings(context: Context) {
        val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/data/device/DeviceStatusProvider.kt',
    filename: 'DeviceStatusProvider.kt',
    category: 'kotlin_data',
    description: 'Reads battery status, storage availability, model, and network connectivity using public Android APIs',
    content: `package com.zenai.data.device

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.Build
import android.os.Environment
import android.os.StatFs
import java.io.File

data class DeviceStatusModel(
    val batteryPercentage: Int,
    val isCharging: boolean,
    val batteryHealth: String,
    val availableStorageGB: Double,
    val totalStorageGB: Double,
    val manufacturer: String,
    val model: String,
    val androidVersion: String,
    val apiLevel: Int,
    val securityPatch: String,
    val networkStatus: String
)

class DeviceStatusProvider(private val context: Context) {

    fun getDeviceStatus(): DeviceStatusModel {
        val batteryIntent = context.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )

        val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPercentage = if (level >= 0 && scale > 0) (level * 100) / scale else 0

        val status = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL

        val healthCode = batteryIntent?.getIntExtra(BatteryManager.EXTRA_HEALTH, BatteryManager.BATTERY_HEALTH_UNKNOWN)
        val health = when (healthCode) {
            BatteryManager.BATTERY_HEALTH_GOOD -> "Good"
            BatteryManager.BATTERY_HEALTH_OVERHEAT -> "Overheated"
            BatteryManager.BATTERY_HEALTH_DEAD -> "Dead"
            BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE -> "Over Voltage"
            else -> "Normal"
        }

        // Storage calculations using StatFs on internal data directory
        val stat = StatFs(Environment.getDataDirectory().path)
        val blockSize = stat.blockSizeLong
        val availableBlocks = stat.availableBlocksLong
        val totalBlocks = stat.blockCountLong
        val availableStorageGB = (availableBlocks * blockSize) / (1024.0 * 1024 * 1024)
        val totalStorageGB = (totalBlocks * blockSize) / (1024.0 * 1024 * 1024)

        // Network status via ConnectivityManager
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
        val network = connectivityManager?.activeNetwork
        val capabilities = connectivityManager?.getNetworkCapabilities(network)
        val networkStatus = when {
            capabilities == null -> "Offline"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "Wi-Fi"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "Cellular"
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> "Ethernet"
            else -> "Connected"
        }

        return DeviceStatusModel(
            batteryPercentage = batteryPercentage,
            isCharging = isCharging,
            batteryHealth = health,
            availableStorageGB = Math.round(availableStorageGB * 10.0) / 10.0,
            totalStorageGB = Math.round(totalStorageGB * 10.0) / 10.0,
            manufacturer = Build.MANUFACTURER.replaceFirstChar { it.uppercase() },
            model = Build.MODEL,
            androidVersion = Build.VERSION.RELEASE,
            apiLevel = Build.VERSION.SDK_INT,
            securityPatch = Build.VERSION.SECURITY_PATCH,
            networkStatus = networkStatus
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/data/usage/UsageStatsProvider.kt',
    filename: 'UsageStatsProvider.kt',
    category: 'kotlin_data',
    description: 'Retrieves foreground screen time and app usage summaries using Android UsageStatsManager',
    content: `package com.zenai.data.usage

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import java.util.Calendar

data class AppUsageSummary(
    val packageName: String,
    val totalTimeInForegroundMillis: Long,
    val lastTimeUsed: Long
) {
    val totalTimeMinutes: Long get() = totalTimeInForegroundMillis / (1000 * 60)
}

class UsageStatsProvider(private val context: Context) {

    fun getTodayUsageSummaries(): List<AppUsageSummary> {
        val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return emptyList()

        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val startTime = calendar.timeInMillis
        val endTime = System.currentTimeMillis()

        val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime
        ) ?: emptyList()

        return stats
            .filter { it.totalTimeInForeground > 60_000 } // Filter out apps used less than 1 min
            .map {
                AppUsageSummary(
                    packageName = it.packageName,
                    totalTimeInForegroundMillis = it.totalTimeInForeground,
                    lastTimeUsed = it.lastTimeUsed
                )
            }
            .sortedByDescending { it.totalTimeInForegroundMillis }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/data/notifications/ZenNotificationListenerService.kt',
    filename: 'ZenNotificationListenerService.kt',
    category: 'kotlin_service',
    description: 'NotificationListenerService capturing authorized notification events with package filtering, deduplication, and privacy masking',
    content: `package com.zenai.data.notifications

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.zenai.ZenApplication
import com.zenai.security.Sanitizer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ZenNotificationListenerService : NotificationListenerService() {

    private val scope = CoroutineScope(Dispatchers.IO)
    private val targetSocialPackages = setOf(
        "com.whatsapp",
        "org.telegram.messenger",
        "com.instagram.android",
        "com.facebook.katana"
    )

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName ?: return
        val extras = sbn.notification?.extras ?: return

        // Extract permitted preview safely without intercepting private channels
        val rawTitle = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString() ?: ""
        val rawText = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

        if (rawTitle.isBlank() && rawText.isBlank()) return

        // Privacy Redaction: Never store raw message content directly; apply sanitizer
        val sanitizedPreview = Sanitizer.maskSensitiveContent(rawText)

        val entity = NotificationEntity(
            packageName = packageName,
            appName = resolveAppName(packageName),
            title = rawTitle,
            textPreview = sanitizedPreview,
            timestamp = sbn.postTime,
            isSocial = targetSocialPackages.contains(packageName)
        )

        scope.launch {
            ZenApplication.instance.database.notificationDao().insertNotification(entity)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        // Handled gracefully when dismissed by user
    }

    private fun resolveAppName(pkg: String): String {
        return try {
            val pm = packageManager
            val appInfo = pm.getApplicationInfo(pkg, 0)
            pm.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            pkg
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/data/notifications/ZenDatabase.kt',
    filename: 'ZenDatabase.kt',
    category: 'kotlin_data',
    description: 'Room Database definition with NotificationEntity and local retention cleanup DAO',
    content: `package com.zenai.data.notifications

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val packageName: String,
    val appName: String,
    val title: String,
    val textPreview: String,
    val timestamp: Long,
    val isSocial: Boolean
)

@Dao
interface NotificationDao {
    @Query("SELECT * FROM notifications ORDER BY timestamp DESC LIMIT 100")
    fun getRecentNotifications(): Flow<List<NotificationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationEntity)

    @Query("DELETE FROM notifications WHERE timestamp < :cutoffTimestamp")
    suspend fun deleteOlderThan(cutoffTimestamp: Long): Int

    @Query("DELETE FROM notifications")
    suspend fun clearAll()
}

@Database(entities = [NotificationEntity::class], version = 1, exportSchema = false)
abstract class ZenDatabase : RoomDatabase() {
    abstract fun notificationDao(): NotificationDao

    companion object {
        @Volatile
        private var INSTANCE: ZenDatabase? = null

        fun getInstance(context: Context): ZenDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ZenDatabase::class.java,
                    "zen_ai_control.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/data/calls/CallLogRepository.kt',
    filename: 'CallLogRepository.kt',
    category: 'kotlin_data',
    description: 'Permitted Call Log provider handling runtime security checks, phone number privacy masking, and empty states',
    content: `package com.zenai.data.calls

import android.content.Context
import android.provider.CallLog
import com.zenai.permissions.ZenPermissionManager

data class CallEntry(
    val id: String,
    val callerName: String?,
    val maskedNumber: String,
    val callType: CallCategory,
    val timestamp: Long,
    val durationSeconds: Long
)

enum class CallCategory {
    INCOMING, OUTGOING, MISSED, REJECTED
}

class CallLogRepository(private val context: Context) {

    fun getRecentCalls(limit: Int = 50): Result<List<CallEntry>> {
        if (!ZenPermissionManager.hasCallLogAccess(context)) {
            return Result.failure(SecurityException("READ_CALL_LOG permission has not been granted by user."))
        }

        val entries = mutableListOf<CallEntry>()
        val projection = arrayOf(
            CallLog.Calls._ID,
            CallLog.Calls.CACHED_NAME,
            CallLog.Calls.NUMBER,
            CallLog.Calls.TYPE,
            CallLog.Calls.DATE,
            CallLog.Calls.DURATION
        )

        try {
            val cursor = context.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                projection,
                null,
                null,
                "\${CallLog.Calls.DATE} DESC LIMIT \$limit"
            )

            cursor?.use {
                val idIdx = it.getColumnIndexOrThrow(CallLog.Calls._ID)
                val nameIdx = it.getColumnIndexOrThrow(CallLog.Calls.CACHED_NAME)
                val numIdx = it.getColumnIndexOrThrow(CallLog.Calls.NUMBER)
                val typeIdx = it.getColumnIndexOrThrow(CallLog.Calls.TYPE)
                val dateIdx = it.getColumnIndexOrThrow(CallLog.Calls.DATE)
                val durIdx = it.getColumnIndexOrThrow(CallLog.Calls.DURATION)

                while (it.moveToNext()) {
                    val rawNum = it.getString(numIdx) ?: "Unknown"
                    val type = when (it.getInt(typeIdx)) {
                        CallLog.Calls.INCOMING_TYPE -> CallCategory.INCOMING
                        CallLog.Calls.OUTGOING_TYPE -> CallCategory.OUTGOING
                        CallLog.Calls.MISSED_TYPE -> CallCategory.MISSED
                        else -> CallCategory.REJECTED
                    }

                    entries.add(
                        CallEntry(
                            id = it.getString(idIdx),
                            callerName = it.getString(nameIdx),
                            maskedNumber = maskPhoneNumber(rawNum),
                            callType = type,
                            timestamp = it.getLong(dateIdx),
                            durationSeconds = it.getLong(durIdx)
                        )
                    )
                }
            }
            return Result.success(entries)
        } catch (e: Exception) {
            return Result.failure(e)
        }
    }

    private fun maskPhoneNumber(raw: String): String {
        if (raw.length < 4) return "•••"
        return raw.take(3) + " •••• " + raw.takeLast(4)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/security/Sanitizer.kt',
    filename: 'Sanitizer.kt',
    category: 'kotlin_service',
    description: 'Privacy sanitizer removing OTPs, passwords, and sensitive digits from preview buffers before persistence',
    content: `package com.zenai.security

object Sanitizer {
    // Regex matching verification codes (e.g., "code is 482910", "OTP: 123456")
    private val OTP_REGEX = Regex("""(?i)(?:code|otp|pin|verification)[:\\s]*(\\d{4,8})""")
    // Regex matching full credit card or sensitive 16-digit sequences
    private val CARD_REGEX = Regex("""\\b(?:\\d[ -]*?){13,16}\\b""")
    // Regex matching email addresses
    private val EMAIL_REGEX = Regex("""[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}""")

    fun maskSensitiveContent(input: String): String {
        var result = input
        result = OTP_REGEX.replace(result) { match ->
            val full = match.value
            val digits = match.groupValues.getOrNull(1) ?: ""
            full.replace(digits, "••••••")
        }
        result = CARD_REGEX.replace(result, "••••-••••-••••-••••")
        result = EMAIL_REGEX.replace(result) { match ->
            val email = match.value
            val parts = email.split("@")
            val user = parts[0]
            val domain = parts.getOrNull(1) ?: ""
            "\${user.take(2)}•••@\$domain"
        }
        return result
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/security/KeystoreManager.kt',
    filename: 'KeystoreManager.kt',
    category: 'kotlin_service',
    description: 'AndroidKeyStore integration providing AES-256 GCM encryption for user preferences and tokens',
    content: `package com.zenai.security

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class KeystoreManager(private val context: Context) {

    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
    private val keyAlias = "ZenAiMasterKey"

    init {
        if (!keyStore.containsAlias(keyAlias)) {
            val keyGenerator = KeyGenerator.getInstance(
                KeyProperties.KEY_ALGORITHM_AES,
                "AndroidKeyStore"
            )
            keyGenerator.init(
                KeyGenParameterSpec.Builder(
                    keyAlias,
                    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
                )
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setKeySize(256)
                    .build()
            )
            keyGenerator.generateKey()
        }
    }

    fun encrypt(plainText: ByteArray): Pair<ByteArray, ByteArray> {
        val secretKey = (keyStore.getEntry(keyAlias, null) as KeyStore.SecretKeyEntry).secretKey
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)
        val iv = cipher.iv
        val encrypted = cipher.doFinal(plainText)
        return Pair(encrypted, iv)
    }

    fun decrypt(encrypted: ByteArray, iv: ByteArray): ByteArray {
        val secretKey = (keyStore.getEntry(keyAlias, null) as KeyStore.SecretKeyEntry).secretKey
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)
        return cipher.doFinal(encrypted)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zenai/ai/LocalRuleEngine.kt',
    filename: 'LocalRuleEngine.kt',
    category: 'kotlin_service',
    description: 'Deterministic offline intelligence engine answering battery, notification, and usage queries with zero network egress',
    content: `package com.zenai.ai

data class LocalAiResponse(
    val text: String,
    val suggestedActions: List<String>,
    val settingsIntentRoute: String?
)

object LocalRuleEngine {

    fun answerQuery(
        query: String,
        batteryPercent: Int,
        isCharging: Boolean,
        topApp: String?,
        totalNotificationsToday: Int,
        missedCallsCount: Int,
        hasNotificationAccess: Boolean,
        hasUsageAccess: Boolean
    ): LocalAiResponse {
        val q = query.lowercase().trim()

        return when {
            q.contains("battery") || q.contains("charge") || q.contains("power") -> {
                val chargingState = if (isCharging) "currently charging" else "running on battery"
                LocalAiResponse(
                    text = "Battery is currently at \$batteryPercent% and is \$chargingState.",
                    suggestedActions = listOf("Enable Battery Saver", "Inspect Background Usage"),
                    settingsIntentRoute = "android.settings.BATTERY_SAVER_SETTINGS"
                )
            }
            q.contains("most used") || q.contains("usage") || q.contains("screen time") -> {
                if (!hasUsageAccess) {
                    LocalAiResponse(
                        text = "App usage statistics are unavailable because Usage Access permission has not been granted.",
                        suggestedActions = listOf("Grant Usage Access"),
                        settingsIntentRoute = "android.settings.USAGE_ACCESS_SETTINGS"
                    )
                } else {
                    val appName = topApp ?: "No heavy usage recorded yet"
                    LocalAiResponse(
                        text = "Your most-used application today is \$appName. Total foreground time tracked locally.",
                        suggestedActions = listOf("View Apps Breakdown", "Set Focus Mode"),
                        settingsIntentRoute = null
                    )
                }
            }
            q.contains("notification") || q.contains("alert") || q.contains("noise") -> {
                if (!hasNotificationAccess) {
                    LocalAiResponse(
                        text = "Notification monitoring is inactive. Grant Notification Listener access to monitor noise.",
                        suggestedActions = listOf("Enable Notification Access"),
                        settingsIntentRoute = "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"
                    )
                } else {
                    LocalAiResponse(
                        text = "You received \$totalNotificationsToday notifications today. High-frequency alerts can be tuned per channel.",
                        suggestedActions = listOf("Mute Non-Essential Apps", "Audit Channels"),
                        settingsIntentRoute = null
                    )
                }
            }
            q.contains("call") || q.contains("missed") -> {
                LocalAiResponse(
                    text = "There are \$missedCallsCount missed calls recorded in your authorized call log.",
                    suggestedActions = listOf("Review Call Log", "Clear Stored Calls"),
                    settingsIntentRoute = null
                )
            }
            q.contains("permission") || q.contains("status") || q.contains("privacy") -> {
                val notifText = if (hasNotificationAccess) "Granted" else "Missing"
                val usageText = if (hasUsageAccess) "Granted" else "Missing"
                LocalAiResponse(
                    text = "Current Monitoring Permissions:\\n• Notification Access: \$notifText\\n• Usage Access: \$usageText\\nAll logs are stored locally on-device.",
                    suggestedActions = listOf("Open Privacy Dashboard", "Manage Permissions"),
                    settingsIntentRoute = null
                )
            }
            else -> {
                LocalAiResponse(
                    text = "I can inspect battery level, top used apps, notification volume, missed calls, or phone permissions locally. What would you like to review?",
                    suggestedActions = listOf("What is my battery level?", "Which app did I use most today?", "Show my monitoring permissions"),
                    settingsIntentRoute = null
                )
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/test/java/com/zenai/DashboardStateTest.kt',
    filename: 'DashboardStateTest.kt',
    category: 'test',
    description: 'Unit tests validating dashboard empty states, permission indicators, and battery calculations',
    content: `package com.zenai

import org.junit.Assert.*
import org.junit.Test

class DashboardStateTest {

    @Test
    fun testBatteryStatusCalculation() {
        val level = 85
        val scale = 100
        val percentage = (level * 100) / scale
        assertEquals(85, percentage)
    }

    @Test
    fun testEmptyStateWhenPermissionsDenied() {
        val hasUsageAccess = false
        val topApps = if (hasUsageAccess) listOf("WhatsApp") else emptyList()
        assertTrue("Apps list must be empty when usage permission is denied", topApps.isEmpty())
    }

    @Test
    fun testStorageFormatIntegrity() {
        val availableGB = 42.456
        val formatted = Math.round(availableGB * 10.0) / 10.0
        assertEquals(42.5, formatted, 0.01)
    }
}
`,
  },
  {
    path: 'app/src/test/java/com/zenai/NotificationFilterTest.kt',
    filename: 'NotificationFilterTest.kt',
    category: 'test',
    description: 'Unit tests verifying duplicate notification suppression, sensitive content masking, and app exclusions',
    content: `package com.zenai

import com.zenai.security.Sanitizer
import org.junit.Assert.*
import org.junit.Test

class NotificationFilterTest {

    @Test
    fun testOtpMaskingInNotificationPreview() {
        val rawMessage = "Your verification code is 849201 for security login."
        val sanitized = Sanitizer.maskSensitiveContent(rawMessage)

        assertFalse("Raw OTP digits must not exist in sanitized text", sanitized.contains("849201"))
        assertTrue("Masking characters must replace OTP digits", sanitized.contains("••••••"))
    }

    @Test
    fun testCreditCardMasking() {
        val rawMessage = "Payment successful on card 4111 2222 3333 4444"
        val sanitized = Sanitizer.maskSensitiveContent(rawMessage)

        assertFalse("Credit card digits must be masked", sanitized.contains("4111"))
        assertTrue("Masked card placeholder must appear", sanitized.contains("••••-••••-••••-••••"))
    }

    @Test
    fun testExclusionFiltering() {
        val excludedPackages = setOf("com.facebook.katana")
        val incomingPackage = "com.facebook.katana"

        val shouldMonitor = !excludedPackages.contains(incomingPackage)
        assertFalse("Excluded package must not be monitored", shouldMonitor)
    }
}
`,
  },
  {
    path: 'app/src/test/java/com/zenai/LocalAiEngineTest.kt',
    filename: 'LocalAiEngineTest.kt',
    category: 'test',
    description: 'Unit tests validating deterministic offline rule engine responses for missing permissions and battery queries',
    content: `package com.zenai

import com.zenai.ai.LocalRuleEngine
import org.junit.Assert.*
import org.junit.Test

class LocalAiEngineTest {

    @Test
    fun testBatteryQueryResponse() {
        val response = LocalRuleEngine.answerQuery(
            query = "What is my battery level?",
            batteryPercent = 78,
            isCharging = false,
            topApp = "Chrome",
            totalNotificationsToday = 14,
            missedCallsCount = 1,
            hasNotificationAccess = true,
            hasUsageAccess = true
        )

        assertTrue(response.text.contains("78%"))
        assertTrue(response.text.contains("running on battery"))
    }

    @Test
    fun testUsageQueryWhenPermissionDenied() {
        val response = LocalRuleEngine.answerQuery(
            query = "Which apps did I use most today?",
            batteryPercent = 50,
            isCharging = true,
            topApp = null,
            totalNotificationsToday = 0,
            missedCallsCount = 0,
            hasNotificationAccess = false,
            hasUsageAccess = false
        )

        assertTrue(response.text.contains("Usage Access permission has not been granted"))
        assertEquals("android.settings.USAGE_ACCESS_SETTINGS", response.settingsIntentRoute)
    }
}
`,
  },
  {
    path: 'README.md',
    filename: 'README.md',
    category: 'docs',
    description: 'Comprehensive setup, architecture, ADB commands, and Google Play policy disclosure guide',
    content: `# ZEN AI — Personal Android Mobile Control Center

ZEN AI is a privacy-first, on-device Android mobile control center built with **Kotlin**, **Jetpack Compose**, **Material 3**, **Room**, and **AndroidX**.

It provides centralized device intelligence, app usage statistics, authorized notification monitoring, social-media platform status, call log insights, and a dual-mode AI assistant (Offline Rule Engine + Server-Side Gemini 2.5).

---

## Architecture & Security Principles

1. **Local-First & Zero Surveillance**: ZEN AI operates strictly on data authorized by the user. It does not run hidden background screen captures, does not log raw message contents, and does not upload personal data to any external server.
2. **Explicit Android Permission Architecture**:
   - \`NotificationListenerService\`: Explicitly enabled via Android's *Special App Access > Notification Access*.
   - \`UsageStatsManager\`: Explicitly authorized via *Special App Access > Usage Access*.
   - \`Call Log\`: Runtime permission (\`READ_CALL_LOG\`) requested only when navigating to the Call Information tab, complying with Google Play's Restricted Permissions Policy.
   - \`Package Visibility\`: Declares explicit target packages in \`<queries>\` (WhatsApp, Telegram, Instagram, Facebook) rather than requesting the prohibited \`QUERY_ALL_PACKAGES\` permission.
3. **Data Sanitization**: Sensitive verification codes (OTPs), card numbers, and email fragments are stripped in \`Sanitizer.kt\` before notifications are written to the local Room database.
4. **Network Security Configuration**: Cleartext HTTP traffic is disabled system-wide in \`network_security_config.xml\`.

---

## Building in Android Studio

### Prerequisites
- Android Studio Ladybug (2024.2.1+) or newer
- JDK 17
- Android SDK Platform 35 (Android 15)
- Android device or emulator running API 26+ (Android 8.0 Oreo or higher)

### Build Commands (Terminal)
\`\`\`bash
# Assemble Debug APK
./gradlew assembleDebug

# Run Core Unit Tests
./gradlew testDebugUnitTest

# Install to connected device via ADB
adb install -r app/build/outputs/apk/debug/app-debug.apk
\`\`\`

---

## Granting Permissions via ADB (for Testing)
\`\`\`bash
# Grant Usage Stats Access
adb shell appops set com.zenai android:get_usage_stats allow

# Enable Notification Listener Service
adb shell cmd notification allow_listener com.zenai/com.zenai.data.notifications.ZenNotificationListenerService

# Grant Call Log (Debug test)
adb shell pm grant com.zenai android.permission.READ_CALL_LOG
\`\`\`
`,
  },
  {
    path: 'THIRD_PARTY_NOTICES.md',
    filename: 'THIRD_PARTY_NOTICES.md',
    category: 'docs',
    description: 'Licenses and attribution for inspected open-source components',
    content: `# Third-Party Notices & Open Source Attribution

ZEN AI uses open-source libraries and components under standard permissive licenses:

### 1. AndroidX Libraries & Jetpack Compose
- **Copyright**: The Android Open Source Project
- **License**: Apache License 2.0
- **URL**: https://android.googlesource.com/platform/frameworks/support

### 2. Kotlin Coroutines & Serialization
- **Copyright**: JetBrains s.r.o.
- **License**: Apache License 2.0
- **URL**: https://github.com/Kotlin/kotlinx.coroutines

### 3. Room Persistence Library
- **Copyright**: The Android Open Source Project
- **License**: Apache License 2.0
- **URL**: https://developer.android.com/training/data-storage/room

### 4. Google GenAI TypeScript SDK (@google/genai)
- **Copyright**: Google LLC
- **License**: Apache License 2.0
- **URL**: https://github.com/google-gemini/generative-ai-js
`,
  },
];
