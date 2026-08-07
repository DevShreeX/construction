import 'package:flutter/material.dart';
import 'models/project_model.dart';
import 'models/weather_model.dart';
import 'services/api_service.dart';

void main() {
  runApp(const ForzexApp());
}

class ForzexApp extends StatelessWidget {
  const ForzexApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Forzex Construction',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF050814),
        primaryColor: const Color(0xFF4DABF7),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF4DABF7),
          secondary: Color(0xFF6EE7FF),
          surface: Color(0xFF111827),
        ),
        cardColor: const Color(0xFF121C2A),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF071021),
          elevation: 4,
        ),
      ),
      home: const ForzexHomeScreen(),
    );
  }
}

class ForzexHomeScreen extends StatefulWidget {
  const ForzexHomeScreen({super.key});

  @override
  State<ForzexHomeScreen> createState() => _ForzexHomeScreenState();
}

class _ForzexHomeScreenState extends State<ForzexHomeScreen> {
  int _selectedIndex = 0;
  List<ConstructionProject> _projects = [];
  SiteWeatherModel? _currentWeather;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _isLoading = true);
    final projects = await ForzexApiService.getProjects();
    final weather = await ForzexApiService.fetchSiteWeather(-1.286389, 36.817223, 'Nairobi Site');
    setState(() {
      _projects = projects;
      _currentWeather = weather;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: const [
            Icon(Icons.construction, color: Color(0xFF6EE7FF)),
            SizedBox(width: 8),
            Text(
              'FORZEX',
              style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFF5C518)),
            ),
            Text(
              ' CONSTRUCTION',
              style: TextStyle(fontSize: 14, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadDashboardData,
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF4DABF7)))
          : _buildBody(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        backgroundColor: const Color(0xFF071021),
        selectedItemColor: const Color(0xFF4DABF7),
        unselectedItemColor: Colors.white54,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.camera_alt), label: 'AI Vision'),
          BottomNavigationBarItem(icon: Icon(Icons.cloud), label: 'Weather'),
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: 'Projects'),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return _buildDashboardView();
      case 1:
        return _buildAiVisionView();
      case 2:
        return _buildWeatherView();
      case 3:
        return _buildProjectsView();
      default:
        return _buildDashboardView();
    }
  }

  Widget _buildDashboardView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWeatherSummaryCard(),
          const SizedBox(height: 16),
          const Text(
            'Active Projects Overview',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          ..._projects.map((proj) => _buildProjectCard(proj)),
        ],
      ),
    );
  }

  Widget _buildWeatherSummaryCard() {
    if (_currentWeather == null) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF121C2A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '📍 ${_currentWeather!.locationName}',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF6EE7FF)),
              ),
              Text(
                '${_currentWeather!.temperature.round()}°C',
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.extrabold, color: Colors.white),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.black26,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              '⚠️ Safety Advisory: ${_currentWeather!.safetyAdvisory}',
              style: const TextStyle(fontSize: 12, color: Color(0xFFF5C518)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(ConstructionProject project) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        title: Text(project.name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text('📍 ${project.location} • Status: ${project.status.toUpperCase()}'),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: project.completionPercentage / 100.0,
              backgroundColor: Colors.white12,
              color: const Color(0xFF4DABF7),
            ),
          ],
        ),
        trailing: Text(
          '\$${(project.budget / 1000000).toStringAsFixed(1)}M',
          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF6EE7FF)),
        ),
      ),
    );
  }

  Widget _buildAiVisionView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.camera_alt, size: 64, color: Color(0xFF6EE7FF)),
            const SizedBox(height: 16),
            const Text(
              'AI Site Camera Inspection',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Capture or select site photos for safety PPE checks & machinery detection.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white70),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4DABF7),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('AI Camera triggered: PPE & Safety Checks Passed!')),
                );
              },
              icon: const Icon(Icons.camera, color: Colors.white),
              label: const Text('Capture Site Photo', style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeatherView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _currentWeather == null
            ? const Text('Loading site weather...')
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.cloud_sync, size: 56, color: Color(0xFF6EE7FF)),
                  const SizedBox(height: 16),
                  Text(_currentWeather!.locationName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('${_currentWeather!.temperature}°C | ${_currentWeather!.conditionLabel}', style: const TextStyle(fontSize: 18)),
                  const SizedBox(height: 16),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(_currentWeather!.safetyAdvisory, textAlign: TextAlign.center),
                    ),
                  )
                ],
              ),
      ),
    );
  }

  Widget _buildProjectsView() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _projects.length,
      itemBuilder: (context, index) => _buildProjectCard(_projects[index]),
    );
  }
}
