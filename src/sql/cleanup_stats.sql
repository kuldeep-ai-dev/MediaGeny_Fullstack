-- Remove dummy analytics stats from the configuration table
delete from admin_config 
where key in (
    'stat_views', 'stat_views_sub',
    'stat_leads', 'stat_leads_sub',
    'stat_engagement', 'stat_engagement_sub',
    'stat_bounce', 'stat_bounce_sub'
);
