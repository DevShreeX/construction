// Dart Model Class for Construction Projects & AI Inspections

class ConstructionProject {
  final String id;
  final String name;
  final String status; // 'planning', 'in-progress', 'completed'
  final String location;
  final double budget;
  final double completionPercentage;
  final double latitude;
  final double longitude;
  final List<ProjectPhase> phases;

  ConstructionProject({
    required this.id,
    required this.name,
    required this.status,
    required this.location,
    required this.budget,
    required this.completionPercentage,
    required this.latitude,
    required this.longitude,
    required this.phases,
  });

  factory ConstructionProject.fromJson(Map<String, dynamic> json) {
    return ConstructionProject(
      id: json['id'] ?? '',
      name: json['name'] ?? 'Unnamed Project',
      status: json['status'] ?? 'planning',
      location: json['location'] ?? '',
      budget: (json['budget'] ?? 0).toDouble(),
      completionPercentage: (json['completionPercentage'] ?? 0.0).toDouble(),
      latitude: (json['latitude'] ?? -1.286389).toDouble(),
      longitude: (json['longitude'] ?? 36.817223).toDouble(),
      phases: (json['phases'] as List<dynamic>?)
              ?.map((p) => ProjectPhase.fromJson(p))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'status': status,
      'location': location,
      'budget': budget,
      'completionPercentage': completionPercentage,
      'latitude': latitude,
      'longitude': longitude,
      'phases': phases.map((p) => p.toJson()).toList(),
    };
  }
}

class ProjectPhase {
  final String id;
  final String title; // 'Foundation', 'Structure', 'Electrical', 'Finishing'
  final bool isCompleted;
  final double estimatedCost;

  ProjectPhase({
    required this.id,
    required this.title,
    required this.isCompleted,
    required this.estimatedCost,
  });

  factory ProjectPhase.fromJson(Map<String, dynamic> json) {
    return ProjectPhase(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      isCompleted: json['isCompleted'] ?? false,
      estimatedCost: (json['estimatedCost'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'isCompleted': isCompleted,
        'estimatedCost': estimatedCost,
      };
}

class SiteAiAnalysis {
  final List<String> safetyPasses;
  final List<String> safetyWarnings;
  final List<String> objectsDetected;
  final double latitude;
  final double longitude;
  final String timestamp;

  SiteAiAnalysis({
    required this.safetyPasses,
    required this.safetyWarnings,
    required this.objectsDetected,
    required this.latitude,
    required this.longitude,
    required this.timestamp,
  });

  factory SiteAiAnalysis.fromJson(Map<String, dynamic> json) {
    return SiteAiAnalysis(
      safetyPasses: List<String>.from(json['safetyPasses'] ?? []),
      safetyWarnings: List<String>.from(json['safetyWarnings'] ?? []),
      objectsDetected: List<String>.from(json['objectsDetected'] ?? []),
      latitude: (json['latitude'] ?? 0.0).toDouble(),
      longitude: (json['longitude'] ?? 0.0).toDouble(),
      timestamp: json['timestamp'] ?? DateTime.now().toIso8601String(),
    );
  }
}
