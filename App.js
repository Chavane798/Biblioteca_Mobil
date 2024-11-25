import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "./components/Data_Base_API"; // Assegure-se de que o caminho de importação esteja correto

function App() {
    const [currentPath, setCurrentPath] = useState(""); // Caminho atual no Firebase Storage
    const [itemsList, setItemsList] = useState([]); // Lista de arquivos do Firebase
    const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
    const [showPopup, setShowPopup] = useState(true); // Controle do pop-up de boas-vindas

    // Função para buscar arquivos do Firebase Storage
    const fetchStorageItems = async (path) => {
        try {
            const directoryRef = ref(storage, path);
            const response = await listAll(directoryRef);

            const filePromises = await Promise.all(
                response.items.map(async (item) => ({
                    name: item.name,
                    url: await getDownloadURL(item),
                }))
            );

            // Ordenar os itens por nome
            const sortedItems = filePromises.sort((a, b) => a.name.localeCompare(b.name));
            setItemsList(sortedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath]);

    // Filtragem dos itens com base no termo de pesquisa
    const filteredItems = itemsList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para abrir links dos arquivos
    const handleOpenLink = async (url) => {
        try {
            await Linking.openURL(url); // Abre o URL do arquivo
        } catch (error) {
            console.error("Cannot open URL:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à minha biblioteca!</Text>

            {/* Pop-up de boas-vindas */}
            {showPopup && (
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <Text style={styles.popupTitle}>Bem-vindo à Biblioteca Online!</Text>
                        <Text style={styles.popupText}>
                            Explore um vasto acervo de livros sobre programação. 
                            Aqui você encontrará recursos para todos os níveis de conhecimento, 
                            desde iniciantes até desenvolvedores avançados.
                        </Text>
                        <Text style={styles.popupText}>
                            Descubra novas tecnologias, aprofunde suas habilidades e alcance 
                            o próximo nível na sua jornada como programador!
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowPopup(false)}
                            style={styles.popupButton}
                        >
                            <Text style={styles.popupButtonText}>Vamos começar!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Campo de pesquisa */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquise por nome..."
                    value={searchTerm}
                    onChangeText={setSearchTerm} // Atualiza o termo de pesquisa
                />
            </View>

            {/* Lista de itens filtrados */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemBox}>
                        <TouchableOpacity onPress={() => handleOpenLink(item.url)}>
                            <Text style={styles.itemText}>📄 {item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => handleOpenLink(item.url)} 
                            style={styles.downloadButton}
                        >
                            <Text style={styles.downloadText}>Visualizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

// Estilos do React Native
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 16,
    },
    popupContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
    },
    popup: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        maxWidth: 400,
        width: "90%",
        textAlign: "justify",
    },
    popupTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    popupText: {
        fontSize: 16,
        marginBottom: 8,
    },
    popupButton: {
        backgroundColor: "#1d4ed8",
        padding: 10,
        borderRadius: 4,
        alignItems: "center",
    },
    popupButtonText: {
        color: "white",
        fontSize: 16,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        padding: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    itemBox: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    itemText: {
        fontSize: 16,
        marginBottom: 8,
        color: "#1f2937",
    },
    downloadButton: {
        backgroundColor: "#1d4ed8",
        padding: 8,
        borderRadius: 4,
        alignItems: "center",
    },
    downloadText: {
        color: "#ffffff",
        fontSize: 16,
    },
});

export default App;
