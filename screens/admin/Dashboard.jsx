import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";

export default function Dashboard() {
  // Example data
  const totalCampaigns = 10;
  const totalNominees = 25;
  const totalPositions = 5;
  const totalUsers = 100;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <View style={{ maxWidth: "80%" }}>
        <Card style={{ elevation: 4 }}>
          <Card.Content>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 16,
              }}
            >
              Dashboard
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Total Campaigns
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "blue" }}
                >
                  {totalCampaigns}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Total Nominees
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "blue" }}
                >
                  {totalNominees}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Total Positions/Offices
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "blue" }}
                >
                  {totalPositions}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                  }}
                >
                  Total Users
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "bold", color: "blue" }}
                >
                  {totalUsers}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 16,
                }}
              >
                Management Sections
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: "blue",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Manage Nominees
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: "green",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Manage Positions/Offices
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    backgroundColor: "purple",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Manage Campaigns
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}
