using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ServiceManagement.API.Data;
using ServiceManagement.API.Data.Seed;
using ServiceManagement.API.Middleware;
using ServiceManagement.API.Services.Implementations;
using ServiceManagement.API.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DATABASE CONFIGURATION
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// CONTROLLERS
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// REGISTER ALL SERVICES (Fixed class names)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IServiceCatalogService, ServiceCatalogService>();
builder.Services.AddScoped<IServiceRequestService, ServiceRequestService>();
builder.Services.AddScoped<ITechnicianService, TechnicianService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IAdminCategoryService, AdminCategoryService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
// Add this line in Program.cs where other services are registered
builder.Services.AddScoped<INotificationService, NotificationService>();


// SWAGGER CONFIGURATION
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT AUTHENTICATION
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        )
    };
});

// AUTHORIZATION
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularCors", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// DATABASE SEEDING
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Ensure database is created
    await context.Database.EnsureCreatedAsync();
    
    // Run migrations if any pending
    if (context.Database.GetPendingMigrations().Any())
    {
        await context.Database.MigrateAsync();
    }
    
    await DataSeeder.SeedAsync(context);
}

// MIDDLEWARE PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.UseRouting();
app.UseCors("AngularCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
