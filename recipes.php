<?php
/**
 * Plat Recipe Management Gateway (CRUD)
 * Integrates SQLite database with standard JSON exchange schemas.
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    exit;
}

// GET REQUESTS: Return list of recipes
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM recipes ORDER BY created_at DESC");
        $results = $stmt->fetchAll();

        // Convert ingredients & steps JSON text block to arrays
        $recipes = [];
        foreach ($results as $r) {
            $r['ingredients'] = json_decode($r['ingredients'], true) ?: [];
            $r['steps'] = json_decode($r['steps'], true) ?: [];
            $recipes[] = $r;
        }

        echo json_encode($recipes);
    } catch (PDOException $e) {
        echo json_encode([]);
    }
    exit;
}

// POST REQUESTS: Handle inserts, updates, and deletes
if ($method === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data || !isset($data['action'])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid recipe CRUD call payload."
        ]);
        exit;
    }

    $action = $data['action'];

    if ($action === 'create' || $action === 'update') {
        $recipe = $data['recipe'];
        
        $id = $recipe['id'];
        $title = trim($recipe['title']);
        $category = trim($recipe['category']);
        $prep = trim($recipe['prep']);
        $cook = trim($recipe['cook']);
        $servings = trim($recipe['servings']);
        $difficulty = trim($recipe['difficulty']);
        $image = trim($recipe['image']);
        $description = trim($recipe['description']);
        
        // Encode arrays back to json strings for SQLite text storage
        $ingredients = json_encode($recipe['ingredients'] ?: []);
        $steps = json_encode($recipe['steps'] ?: []);
        $now = time() * 1000;

        if (empty($title)) {
            echo json_encode(["success" => false, "message" => "Recipe title is mandatory."]);
            exit;
        }

        try {
            if ($action === 'create') {
                $stmt = $pdo->prepare("INSERT INTO recipes (id, title, category, prep, cook, servings, difficulty, image, description, ingredients, steps, created_at, updated_at) VALUES (:id, :title, :category, :prep, :cook, :servings, :difficulty, :image, :description, :ingredients, :steps, :created_at, :updated_at)");
                $stmt->execute([
                    'id' => $id,
                    'title' => $title,
                    'category' => $category,
                    'prep' => $prep,
                    'cook' => $cook,
                    'servings' => $servings,
                    'difficulty' => $difficulty,
                    'image' => $image,
                    'description' => $description,
                    'ingredients' => $ingredients,
                    'steps' => $steps,
                    'created_at' => $now,
                    'updated_at' => $now
                ]);
            } else {
                $stmt = $pdo->prepare("UPDATE recipes SET title = :title, category = :category, prep = :prep, cook = :cook, servings = :servings, difficulty = :difficulty, image = :image, description = :description, ingredients = :ingredients, steps = :steps, updated_at = :updated_at WHERE id = :id");
                $stmt->execute([
                    'id' => $id,
                    'title' => $title,
                    'category' => $category,
                    'prep' => $prep,
                    'cook' => $cook,
                    'servings' => $servings,
                    'difficulty' => $difficulty,
                    'image' => $image,
                    'description' => $description,
                    'ingredients' => $ingredients,
                    'steps' => $steps,
                    'updated_at' => $now
                ]);
            }

            // Return latest dataset
            returnAllRecipes($pdo);

        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Recipe table write exception: " . $e->getMessage()
            ]);
        }

    } elseif ($action === 'delete') {
        $id = isset($data['id']) ? $data['id'] : '';
        if (empty($id)) {
            echo json_encode(["success" => false, "message" => "Recipe target ID required for delete."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM recipes WHERE id = :id");
            $stmt->execute(['id' => $id]);

            returnAllRecipes($pdo);
        } catch (PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Recipe delete query exception: " . $e->getMessage()
            ]);
        }
    }
    exit;
}

// Helper to fetch and return all updated recipe rows
function returnAllRecipes($pdo) {
    $stmt = $pdo->query("SELECT * FROM recipes ORDER BY created_at DESC");
    $results = $stmt->fetchAll();
    
    $recipes = [];
    foreach ($results as $r) {
        $r['ingredients'] = json_decode($r['ingredients'], true) ?: [];
        $r['steps'] = json_decode($r['steps'], true) ?: [];
        $recipes[] = $r;
    }

    echo json_encode([
        "success" => true,
        "recipes" => $recipes
    ]);
}
