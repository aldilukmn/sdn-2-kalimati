import re

file_path = "D:/Website/sdn-2-kalimati/app/(admin)/dashboard-akademik/components/RecentActivities.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update the interface
old_interface = '''interface RecentActivitiesProps {
  activities?: RecentActivity[];
  loading: boolean;
}

export function RecentActivities({ activities = [], loading }: RecentActivitiesProps) {'''
new_interface = '''interface RecentActivitiesProps {
  title?: string;
  activities?: RecentActivity[];
  loading: boolean;
}

export function RecentActivities({ title = "Aktivitas Terbaru", activities = [], loading }: RecentActivitiesProps) {'''
content = content.replace(old_interface, new_interface)

# Update the title in loading state
old_loading_title = '''        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Aktivitas Terbaru
        </h3>'''
new_loading_title = '''        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          {title}
        </h3>'''
content = content.replace(old_loading_title, new_loading_title)

# Update the title in loaded state
old_loaded_title = '''        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          Aktivitas Terbaru
        </h3>'''
new_loaded_title = '''        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          {title}
        </h3>'''
content = content.replace(old_loaded_title, new_loaded_title)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
