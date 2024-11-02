using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
var app = builder.Build();
app.UseCors(x => x.AllowAnyOrigin()
.AllowAnyHeader()
.AllowAnyMethod()
);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
