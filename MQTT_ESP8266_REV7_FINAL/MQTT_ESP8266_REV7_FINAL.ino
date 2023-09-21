//Programa Teste: Sensor de temperatura DS18B20 com ESP8266 APP WEB MQTT NODE RED
//Autor: Jurandir / Jonas / Rafael

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Update these with values suitable for your network.

const char* ssid = "SSID da Rede do Cliente";
const char* password = "Senha de Acesso ao Roteador do Cliente";
const char* mqtt_server = "test.mosquitto.org";  /// example 192.168.0.19

//Pino de conexao do sensor de temperatura
#define ONE_WIRE_BUS 2

//Cria uma instancia OneWire para comunicacao com dispositivos no barramento
OneWire oneWire(ONE_WIRE_BUS);

//Cria uma instancia do Sensor de Temperatura
DallasTemperature sensors(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);

char msg[50];
uint8_t mac[6];
char macTemp[20];

void setup() { 
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  envia_macTemp();
  ESP.deepSleep(10e6);
}

void setup_wifi() {

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(10);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void captura_macTemp(){

  sensors.requestTemperatures();
  double Input = sensors.getTempCByIndex(0);
  int InputCalc = Input * 100;

  WiFi.macAddress(mac);
  sprintf(macTemp, "%02X%02X%02X%02X%02X%02X:%ld", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], InputCalc);
  client.publish("UFAPE01/Mac", macTemp);
  client.loop();
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "ESP8266Client-Ufape";
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 3 seconds");
    }
  }
}

void envia_macTemp() {
  while (!client.connected()) {
    reconnect();
  }
  if (client.connected()) {
    captura_macTemp();
  }
}

void loop() {
}